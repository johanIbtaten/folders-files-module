<template>
  <div class="container mt-3" :class="{ 'drag-file': isDragFile }">
    <div class="row">
      <div class="col-md-3">
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
            <div
              class="cog position-absolute d-flex flex-column align-items-end"
              v-if="isCog"
            >
              <button
                class="btn btn-outline-secondary"
                @click="isCogOpen = !isCogOpen"
              >
                <i class="fas fa-cog"></i>
              </button>
              <div
                class="d-flex flex-column  align-items-strech"
                v-if="isCogOpen"
              >
                <button class="btn btn-secondary" @click="renameFolder">
                  <i class="fas fa-pen pr-2"></i> {{ __('Renommer') }}
                </button>
                <button
                  class="btn btn-outline-danger pr-2"
                  @click="deleteFolder"
                >
                  <i class="fas fa-trash pr-2"></i> {{ __('Supprimer') }}
                </button>
              </div>
            </div>
            <h4>
              {{ folderName }}
            </h4>
          </div>
          <div class="text-center mb-3">
            <slot name="link"></slot>
          </div>
          <div class="mb-4">
            <label class="form-control form-control-search">
              <input
                type="text"
                :placeholder="searchFilesPlaceholder"
                v-model="search"
              />
              <i class="fas fa-search"></i>
            </label>
          </div>
          <slot name="content" :filteredFiles="filteredFiles"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deburr } from 'lodash';
import FolderList from './FolderList/FolderList';

export default {
  name: 'Folder',
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
    unclassifiedFiles() {
      let unclassifiedFiles = [];
      unclassifiedFiles = this.files.filter(file => {
        let isClassified = false;
        this.folders.map(folder => {
          if (folder.items.includes(file.id)) {
            isClassified = true;
          }
        });
        return !isClassified;
      });
      return unclassifiedFiles;
    },
    unclassifiedCount() {
      return this.unclassifiedFiles.length;
    },
    folderName() {
      if (this.selectedFolder === 'all') {
        return this.all;
      }
      if (this.selectedFolder.name === 'unclassified') {
        return this.unclassified;
      }
      return this.selectedFolder.name;
    },
    filteredFiles() {
      let files = this.files;
      if (this.selectedFolder && this.selectedFolder !== 'all') {
        if (this.selectedFolder.name === 'unclassified') {
          return this.unclassifiedFiles;
        } else {
          files = files.filter(file => {
            return this.selectedFolder.items.includes(file.id);
          });
        }
      }

      if (this.search) {
        return files.filter(file => {
          return deburr(file.name.toLowerCase()).match(
            deburr(this.search.toLowerCase())
          );
        });
      }
      return files;
    },
    isCog() {
      return !(
        this.selectedFolder === 'all' ||
        this.selectedFolder.name === 'unclassified'
      );
    }
  },
  methods: {
    renameFolder() {
      window.app.ui
        .prompt(this.__('Renommer le dossier'), this.selectedFolder.name)
        .then(response => {
          if (response) {
            this.$root.$emit('rename-folder', {
              id: this.selectedFolder.id,
              name: response
            });
          }
        });
    },
    deleteFolder() {
      window.app.ui
        .confirm(
          this.__(
            'Voulez-vous vraiment supprimer ce dossier ? Un fois supprimé, vous pourrez retrouver les campagnes de ce dossier dans "Toutes les campagnes" et "Les campagnes non-classées"'
          )
        )
        .then(() => {
          this.$root.$emit('delete-folder', this.selectedFolder.id);
          this.selectedFolder = 'all';
        });
    },
    handleGetFolderContent(payload) {
      this.selectedFolder = payload;
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
