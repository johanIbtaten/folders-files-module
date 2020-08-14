<template>
  <div
    class="c-folder-item-link btn d-flex align-items-center border-bottom py-3 text-left pl-0"
    :class="{
      active: isActive
    }"
  >
    <!-- On affiche l(icone du folder ouvert quand isActive est à true) -->
    <i v-if="!isActive" class="far fa-folder fa-fw btn btn-link"></i>
    <i v-else class="far fa-folder-open fa-fw btn btn-link"></i>
    <span class="pl-3 pr-3">{{ folderName }}</span>
    <span class="badge badge-secondary ml-auto">{{ folderCount }}</span>
    <!-- On affiche l'icone de drag sur tous les folders à part le folder unclassified 
    L'attribut data-drag-folder détermine que l'action de drag se fera sur cette élément-->
    <i
      v-if="folder && folder.name !== 'unclassified'"
      class="fas fa-arrows-alt-v btn btn-link ml-2"
      data-drag-folder
    ></i>
  </div>
</template>

<script>
export default {
  name: 'FolderItemLink',
  props: [
    'folder',
    'selectedFolder',
    'all',
    'unclassified',
    'allCount',
    'unclassifiedCount'
  ],
  computed: {
    isActive() {
      if (this.selectedFolder) {
        if (this.selectedFolder === 'all' && this.allCount) {
          return true;
        }
        if (this.folder) {
          return this.selectedFolder.id === this.folder.id;
        }
      }
      return null;
    },
    folderName() {
      if (this.all) {
        return this.all;
      }
      if (this.folder) {
        if (this.folder.name === 'unclassified') {
          return this.unclassified;
        }
        return this.folder.name;
      }
      return null;
    },
    folderCount() {
      if (this.allCount) {
        return this.allCount;
      }
      if (this.folder) {
        if (this.unclassified && this.folder.name === 'unclassified') {
          return this.unclassifiedCount;
        }
        return this.folder.items.length;
      }
      return null;
    }
  }
};
</script>

<style scoped lang="scss">
.c-folder-item-link.active {
  background: rgb(178, 207, 245);
  .fa-folder:before {
    content: '\f07c';
  }
}
.fas {
  font-size: 0.7rem !important;
}
.c-folder-item-link:hover:not(.active) {
  background: #eee;
}
</style>
