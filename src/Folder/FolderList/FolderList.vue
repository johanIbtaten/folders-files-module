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
    <a
      class="d-flex align-items-center border-bottom py-2"
      @click.prevent
      href="#"
    >
      <i class="fas fa-folder"></i>
      <span class="pl-3">Toutes les campagnes</span>
    </a>
    <draggable v-model="dragFolders" v-bind="dragOptions">
      <FolderItem
        v-for="folder in filteredFolder"
        :key="folder.id"
        :folder="folder"
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
import draggable from 'vuedraggable';
import { deburr } from 'lodash';

export default {
  name: 'FolderListing',
  props: ['folders'],
  components: {
    FolderItem,
    draggable
  },
  data() {
    return {
      search: ''
    };
  },
  computed: {
    dragFolders: {
      get() {
        return this.folders;
      },
      set(value) {
        console.log(value);
        this.$root.$emit('folder-move', value);
      }
    },
    filteredFolder() {
      return this.folders.filter(folder => {
        return deburr(folder.name.toLowerCase()).match(
          deburr(this.search.toLowerCase())
        );
      });
    },
    dragOptions() {
      return {
        animation: 150,
        //handle: '[data-drag-category]',
        forceFallback: true // Key to make autoScroll works
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
