<template>
  <div>
    <a
      class="c-folder-item-link btn-link btn d-flex align-items-center border-bottom py-3"
      :class="{
        active: isActive
      }"
      @click.prevent
      href="#"
    >
      <i class="far fa-folder"></i>
      <span class="pl-3">{{ name ? name : folder.name }}</span
      >
      <span class="badge badge-secondary ml-auto">{{
        name ? '' : folder.items.length
      }}</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'FolderItemLink',
  props: ['name', 'folder', 'selectedFolder', 'id'],
  // data() {
  //   return {
  //     current_folder_id: null;
  //   }
  // },
  computed: {
    isActive() {
      if (this.selectedFolder) {
        if (this.name) {
          return this.selectedFolder.id === this.id;
        }
        if (this.folder) {
          return this.selectedFolder.id === this.folder.id;
        }
      }
      return false;
    }
  }
};
//  :class="{ active: name ? false : this.selectFolderId === this.folder.id }"
// {{ name ? '' : folder.items }}
</script>

<style scoped lang="scss">
a.active {
  background: rgb(178, 207, 245);
  .fa-folder:before{
    content:"\f07c";
  }
}
a:hover:not(.active) {
  background: #eee;
}

</style>
