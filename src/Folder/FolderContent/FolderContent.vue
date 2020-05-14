<template>
  <div>
    <div class="text-center">
      <button class="btn btn-outline-secondary float-right">
        <i class="fas fa-cog"></i>
      </button>
      <h4><slot name="title"></slot></h4>
    </div>
    <div class="text-center mb-3">
      <slot name="link"></slot>
    </div>
    <div class="mb-4">
      <label class="form-control form-control-search">
        <input
          type="text"
          placeholder="Rechercher dans les campagnes"
          v-model="search"
        />
        <i class="fas fa-search"></i>
      </label>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'FolderContent',
  props: ['inputSearch'],
  data() {
    return {
      searchFiles: ''
    };
  },
  computed: {
    search: {
      get() {
        return this.searchFiles;
      },
      set(val) {
        this.searchFiles = val;
        this.$root.$emit('files-search', val);
      }
    }
    // inputVal: {
    //   get() {
    //     return this.inputSearch;
    //   },
    //   set(val) {
    //     this.$emit('files-search', val);
    //   }
    // }
  }
};
</script>

<style scoped lang="scss"></style>
