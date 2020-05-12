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
    <FoldersList :filteredFolder="filteredFolder" class="mb-4"></FoldersList>
    <div>
      <button class="btn btn-lightblue2 btn-fa-left">
        <i class="fas fa-folder-plus"></i> {{ __('Nouveau dossier') }}
      </button>
    </div>
  </div>
</template>

<script>
import { deburr } from 'lodash';

import FoldersList from './FoldersList';

export default {
  name: 'ElementsList',
  props: ['folders'],
  components: {
    FoldersList
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
