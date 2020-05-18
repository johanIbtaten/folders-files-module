<template>
  <div>
    <div class="d-flex mb-2 align-items-center">
      <h4 class="box-title">
        {{ __('Dossiers') }}
      </h4>
      <button class="btn btn-link ml-auto" @click="createFolder">
        <i class="fas fa-folder-plus"></i>
      </button>
    </div>
    <div>
      <label class="form-control form-control-search">
        <input type="text" placeholder="Recherche" v-model="search" />
        <i class="fas fa-search"></i>
      </label>
    </div>

    <div @click.prevent="handleFixedFolderClick(all)" v-if="all">
      <FolderItemLink
        :all="all"
        :selectedFolder="selectedFolder"
      ></FolderItemLink>
    </div>

    <draggable
      v-model="filteredFolder"
      v-bind="dragFoldersOptions"
      draggable=".js-is-draggable"
    >
      <FolderItem
        v-for="folder in filteredFolder"
        :key="folder.id"
        :folder="folder"
        :selectedFolder="selectedFolder"
        :unclassified="unclassified"
      ></FolderItem>
    </draggable>
    <div class="mt-4">
      <button class="btn btn-lightblue2 btn-fa-left" @click="createFolder">
        <i class="fas fa-folder-plus"></i> {{ __('Nouveau dossier') }}
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
  props: ['folders', 'all', 'unclassified', 'selectedFolder'],
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
          return deburr(folder.name.toLowerCase()).match(
            deburr(this.search.toLowerCase())
          );
        });
      },
      set(value) {
        console.log(value);
        this.$root.$emit('folder-move', value);
      }
    },
    dragFoldersOptions() {
      return {
        animation: 150,
        group: {
          name: 'folders',
          put: false
        },
        //handle: '[data-drag-category]',
        forceFallback: true
      };
    }
  },
  methods: {
    createFolder() {
      window.app.ui
        .prompt(this.__('Ajouter un nouveau dossier'))
        .then(response => {
          if (response) {
            this.$root.$emit('create-folder', response);
          }
        });
    },
    handleFixedFolderClick(fixedFolder) {
      this.$root.$emit('fixed-folder-click', fixedFolder);
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ a:hover {
  text-decoration: none;
}
/deep/ i.fas {
  font-size: 1rem;
}
</style>
