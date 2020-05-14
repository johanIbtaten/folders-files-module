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
      v-if="allCampaigns"
      class="d-flex align-items-center border-bottom py-2"
      @click.prevent="handleGetAllClick"
      href="#"
    >
      <i class="fas fa-folder"></i>
      <span class="pl-3">Toutes les campagnes</span>
    </a>
    <a
      v-if="unclassifiedCampaigns"
      class="d-flex align-items-center border-bottom py-2"
      @click.prevent="handleGetUnclassClick"
      href="#"
    >
      <i class="fas fa-folder"></i>
      <span class="pl-3">Les campagnes non classées</span>
    </a>
    <draggable v-model="filteredFolder" v-bind="dragFoldersOptions">
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
  props: ['folders', 'allCampaigns', 'unclassifiedCampaigns'],
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
    },
    handleGetAllClick() {
      this.$root.$emit('get-all');
    },
    handleGetUnclassClick() {
      this.$root.$emit('get-unclassified');
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

