<template>
  <!-- On fait apparaitre les zones de drop sur les folders pour les files
  en ajoutant la class drag-file si isDragFile est à true
  -->
  <div class="container mt-3" :class="{ 'drag-file': isDragFile }">
    <div class="row">
      <div class="col-md-3">
        <!-- Composant des folders, on lui passe en props des folders et des props d'affichages -->
        <FolderList
          :folders="folders"
          :all="all"
          :unclassified="unclassified"
          :allCount="files.length"
          :unclassifiedCount="unclassifiedCount"
          :selectedFolder="selectedFolder"
        ></FolderList>
      </div>
      <div class="col-md-9">
        <div>
          <div class="text-center">
            <!-- On affiche le bouton cog quand il est nécessaire -->
            <div class="cog position-absolute d-flex flex-column align-items-end" v-if="isCog">
              <button class="btn btn-outline-secondary" @click="isCogOpen = !isCogOpen">
                <i class="fas fa-cog"></i>
              </button>
              <div class="d-flex flex-column align-items-strech" v-if="isCogOpen">
                <button class="btn btn-secondary" @click="renameFolder">
                  <i class="fas fa-pen pr-2"></i>
                  {{ __('Renommer') }}
                </button>
                <button class="btn btn-outline-danger pr-2" @click="deleteFolder">
                  <i class="fas fa-trash pr-2"></i>
                  {{ __('Supprimer') }}
                </button>
              </div>
            </div>
            <!-- On affiche le nom du folder courant -->
            <h4>{{ folderName }}</h4>
          </div>
          <div class="text-center mb-3">
            <!-- On récupère le link depuis le slot link -->
            <slot name="link"></slot>
          </div>
          <div class="mb-4">
            <!-- On affiche le champ de recherche des files -->
            <label class="form-control form-control-search">
              <input type="text" :placeholder="searchFilesPlaceholder" v-model="search" />
              <i class="fas fa-search"></i>
            </label>
          </div>
          <!-- On affiche le scoped slot content et on passe les props de slot ici -->
          <slot
            name="content"
            :filteredFiles="filteredSearchFiles"
            :selectedFolder="selectedFolder"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// On importe la fonction deburr de lodash qui retire les accents
import { deburr } from 'lodash';
import FolderList from './FolderList/FolderList';

export default {
  name: 'Folder',
  // On récupère les props
  props: ['folders', 'files', 'all', 'unclassified', 'searchFilesPlaceholder'],
  data() {
    return {
      search: '',
      selectedFolder: 'all',
      isDragFile: false,
      isCogOpen: false
    };
  },
  components: {
    FolderList
  },
  computed: {
    // On récupère les unclassified files en filtrant les files
    unclassifiedFiles() {
      let unclassifiedFiles = [];
      unclassifiedFiles = this.files.filter(file => {
        // On récupère le file courant depuis files
        let isClassified = false;
        // On boucle sur les folders
        this.folders.map(folder => {
          // On récupère le folder courant
          // Si le tableau des items du folder contient file.id
          if (folder.items.includes(file.id)) {
            // alors c'est que ce file est classé dans un folder
            // et donc isClassified passe à true
            isClassified = true;
          }
        });
        // filter retourne seulement le files si il n'est pas classés dans un folder
        // donc un file dont isClassified reste à false
        return !isClassified;
      });
      // On retourne la liste des files unclassified
      return unclassifiedFiles;
    },
    // Contient le nombre de files unclassified
    unclassifiedCount() {
      return this.unclassifiedFiles.length;
    },
    folderName() {
      // Si le folder selectionné est all alors on récupère le name depuis la prop all
      if (this.selectedFolder === 'all') {
        return this.all;
      }
      // Si le folder selectionné est all alors on récupère le name depuis la prop unclassified
      if (this.selectedFolder.name === 'unclassified') {
        return this.unclassified;
      }
      // Sinon on retourne le nom du folder selectionné
      return this.selectedFolder.name;
    },
    // Retourne les files filtrés par folder
    filteredFiles() {
      let files = this.files;
      // Si le dossier sélectionné est all
      if (this.selectedFolder && this.selectedFolder === 'all') {
        files.map(file => {
          let isClassified = false;
          this.folders.map(folder => {
            if (folder.items.includes(file.id)) {
              isClassified = true;
              // Si le file.id est classé dans un folder alors
              // On ajoute une propriété classifiedIn à l'objet file courant
              // avec pour valeur le nom du folder
              file['classifiedIn'] = folder.name;
            }
          });
          // Si le fichier n'est pas classé on ajoute une propriété vide
          // classifiedIn à l'objet file courant
          if (!isClassified) {
            file['classifiedIn'] = '';
          }
          // On le retourne le file transformé
          return file;
        });
      }

      if (this.selectedFolder && this.selectedFolder !== 'all') {
        // Si le folder selectionné est unclassified
        if (this.selectedFolder.name === 'unclassified') {
          // On retourne les files unclassified
          return this.unclassifiedFiles;
        } else {
          // Pour les autres folder sélectionnés
          files = files.filter(file => {
            // On retourne les files classés dans le folder
            return this.selectedFolder.items.includes(file.id);
          });
        }
      }
      return files;
    },
    filteredSearchFiles() {
      let files = this.filteredFiles;

      // Si le variable search du champ de recherche n'est pas vide
      if (this.search) {
        // Retourne les files du folder dont le name match avec la string de la recherche
        files = this.filteredFiles.filter(file => {
          // deburr est une fonction de lodash qui retire les accents
          return deburr(file.name.toLowerCase()).match(
            deburr(this.search.toLowerCase())
          );
        });
      }
      return files;
    },
    // On retourne le cog si le folder n'est pas all ou unclassified
    isCog() {
      return !(
        this.selectedFolder === 'all' ||
        this.selectedFolder.name === 'unclassified'
      );
    }
  },
  methods: {
    // Permet de renommer un folder créé par l'utilisateur
    renameFolder() {
      window.app.ui
        // On affiche un prompt avec la name du folder
        // Il retourne un promesse si l'on valide
        .prompt(this.__('Renommer le dossier'), this.selectedFolder.name)
        .then(response => {
          if (response) {
            // On émet un event rename-folder avec un objet en payload
            // qui comprend la l'id du folder et le nouveau name
            this.$root.$emit('rename-folder', {
              id: this.selectedFolder.id,
              name: response
            });
          }
        });
    },
    deleteFolder() {
      window.app.ui
        // On affiche un confirm
        // Il retourne un promesse si l'on valide
        .confirm(
          this.__(
            'Voulez-vous vraiment supprimer ce dossier ? Un fois supprimé, vous pourrez retrouver les campagnes de ce dossier dans "Toutes les campagnes" et "Les campagnes non-classées"'
          )
        )
        .then(() => {
          // On émet un event delete-folder avec l'id du folder en payload
          this.$root.$emit('delete-folder', this.selectedFolder.id);
          // On retourne sur le folder all
          this.selectedFolder = 'all';
        });
    },
    handleGetFolderContent(payload) {
      this.selectedFolder = payload;
      this.isCogOpen = false;
    },
    handleFixedFolderClick(payload) {
      if (payload === 'all') {
        this.selectedFolder = payload;
      }
    },
    handleStartDragFile() {
      this.isDragFile = true;
    },
    handleEndDragFile() {
      this.isDragFile = false;
    }
  },
  created() {
    this.$root.$on('get-folder-content', this.handleGetFolderContent);
    this.$root.$on('fixed-folder-click', this.handleFixedFolderClick);
    this.$root.$on('start-drag-file', this.handleStartDragFile);
    this.$root.$on('end-drag-file', this.handleEndDragFile);
  }
};
</script>

<style scoped lang="scss">
/deep/ a:hover {
  text-decoration: none;
}

/deep/ .dropZoneFile .chosen {
  display: none;
}

.cog {
  right: 0;
  z-index: 1;
}
</style>
