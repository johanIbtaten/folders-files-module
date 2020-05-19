<template>
  <div class="container mt-3" :class="{ 'drag-file': isDragFile }">
    <div class="row">
      <div class="col-3">
        <FolderList
          :folders="folders"
          :all="all"
          :unclassified="unclassified"
          :allCount="files.length"
          :unclassifiedCount="unclassifiedCount"
          :selectedFolder="selectedFolder"
        ></FolderList>
      </div>
      <div class="col-9">
        <div>
          <div class="text-center">
            <button class="btn btn-outline-secondary float-right">
              <i class="fas fa-cog"></i>
            </button>
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
      isDragFile: false
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
    }
  },
  methods: {
    handleGetFolderContent(val) {
      this.selectedFolder = val;
    },
    handleFixedFolderClick(val) {
      if (val === 'all') {
        this.selectedFolder = val;
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
</style>
