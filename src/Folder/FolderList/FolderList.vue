<template>
  <div>
    <div class="d-flex mb-2 align-items-center">
      <h4 class="box-title">
        {{ __('Dossiers') }}
      </h4>
      <button class="btn btn-link ml-auto">
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
    <FolderItem
      v-for="folder in filteredFolder"
      :key="folder.id"
      :folder="folder"
    ></FolderItem>
    <div class="mt-4">
      <button class="btn btn-lightblue2 btn-fa-left">
        <i class="fas fa-folder-plus"></i> {{ __('Nouveau dossier') }}
      </button>
    </div>
  </div>
</template>

<script>
import { deburr } from 'lodash';

// import FolderListing from './FolderListing';
import FolderItem from './FolderItem';

export default {
  name: 'FolderListing',
  props: ['folders'],
  components: {
    FolderItem
  },
  data() {
    return {
      search: ''
    };
  },
  computed: {
    filteredFolder() {
      return this.folders.filter(folder => {
        return deburr(folder.name.toLowerCase()).match(
          deburr(this.search.toLowerCase())
        );
      });
    }
  },
  methods: {
    addFolder() {
      window.app.ui
        .prompt(this.__('Ajouter un nouveau dossier'))
        .then(response => {
          this.$store.dispatch('loading', {
            event: 'addCategory',
            isLoading: true
          });
          if (response) {
            this.$store.dispatch('addCategory', response).then(() => {
              this.$store.dispatch('loading', {
                event: 'addCategory',
                isLoading: false
              });
            });
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
