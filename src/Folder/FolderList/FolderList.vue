<template>
  <div>
    <div class="d-flex mb-2 align-items-center">
      <h4 class="box-title">{{ __('Dossiers') }}</h4>
      <button class="btn btn-link ml-auto" @click="createFolder">
        <i class="fas fa-folder-plus"></i>
      </button>
    </div>
    <div>
      <label class="form-control form-control-search">
        <input type="text" :placeholder="__('Rechercher')" v-model="search" />
        <i class="fas fa-search"></i>
      </label>
    </div>

    <div @click.prevent="handleFixedFolderClick('all')">
      <FolderItemLink :all="all" :selectedFolder="selectedFolder" :allCount="allCount"></FolderItemLink>
    </div>

    <!-- On rend la liste des FolderItem draggable 
    On fait un v-model sur les filteredFolder c'est ce tableau d'objets qui va 
    se modifier en déplaçant les items.
    On bind les options de draggable dragFoldersOptions
    On affiche la liste si il y au moins un folder en plus du folder unclassified    
    Les items qui seront draggable auront la class .js-is-draggable
    -->
    <draggable
      v-model="filteredFolder"
      v-bind="dragFoldersOptions"
      draggable=".js-is-draggable"
      v-if="folders.length > 1"
    >
      <!-- Composant des folders
      On boucle sur les folders filtrés
      On lui passe les folders
      -->
      <FolderItem
        v-for="folder in filteredFolder"
        :key="folder.id"
        :folder="folder"
        :selectedFolder="selectedFolder"
        :unclassified="unclassified"
        :unclassifiedCount="unclassifiedCount"
      ></FolderItem>
    </draggable>

    <!-- Si il n'y a que le folder unclassified dans folder mais pas de folder utilisateur
    on affiche un message
    -->
    <div class="c_no_folder p-4 text-center text-muted font-weight-bold" v-if="folders.length <= 1">
      <i class="fa fa-folder fa-3x pb-3"></i>
      <p>Vous n'avez pas encore de dossier</p>
      <p>
        Les dossiers peuvent être utilisés pour organiser les campagnes et avoir
        des statistiques regroupées.
      </p>
    </div>
    <div class="mt-4">
      <button class="btn btn-lightblue2 btn-fa-left" @click="createFolder">
        <i class="fas fa-folder-plus"></i>
        {{ __('Nouveau dossier') }}
      </button>
    </div>
  </div>
</template>

<script>
import FolderItem from './FolderItem';
import FolderItemLink from './FolderItemLink';
import draggable from 'vuedraggable';
import { deburr } from 'lodash';

export default {
  name: 'FolderListing',
  props: [
    'folders',
    'all',
    'unclassified',
    'selectedFolder',
    'unclassifiedCount',
    'allCount'
  ],
  components: {
    FolderItem,
    FolderItemLink,
    draggable
  },
  data() {
    return {
      search: ''
    };
  },
  computed: {
    filteredFolder: {
      get() {
        return this.folders.filter(folder => {
          // On ne filtre pas le folder unclassified donc on le retourne toujours
          if (folder.name === 'unclassified') {
            return true;
          }
          return deburr(folder.name.toLowerCase()).match(
            deburr(this.search.toLowerCase())
          );
        });
      },
      /* Quand la valeur de filteredFolder change à cause de draggable qui change
      l'ordre des objets dans le tableau alors on émet un event pour indiqué que l'ordre des folders a changé
      pour mettre à jour la bdd et le store 
      */
      set(value) {
        this.$root.$emit('folder-move', value);
      }
    },
    dragFoldersOptions() {
      return {
        animation: 150,
        group: {
          // Pour dragger un item d'une liste à une autre du même group
          name: 'folders',
          // On ne peut pas ajouter d'items d'une autre liste
          put: false
        },
        // Class css placé sur le tag HTML qui doit permettre le drag
        handle: '[data-drag-folder]'
        //forceFallback: true
      };
    }
  },
  methods: {
    // Ouvre un prompt pour créer un folder
    createFolder() {
      window.app.ui
        .prompt(this.__('Ajouter un nouveau dossier'))
        .then(response => {
          if (response) {
            // La réponse est émise pour la mettre en bdd et mettre à jour le store
            this.$root.$emit('create-folder', response);
          }
        });
    },
    // Gère le click sur le folder all et unclassified
    handleFixedFolderClick(folderName) {
      this.$root.$emit('fixed-folder-click', folderName);
    }
  }
};
</script>

<style scoped lang="scss">
// Permet de styliser les enfants du composant
/deep/ a:hover {
  text-decoration: none;
}
/deep/ i.fas {
  font-size: 1rem;
}

.c_no_folder {
  background: #f4f4f4;
  margin-top: -1px;
  i {
    color: #ced4da;
  }
}
</style>
