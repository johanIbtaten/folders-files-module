<template>
  <div>
    <!--{{ unclassified }}
     {{ folder ? folder.id : '' }} -->
    <!-- {{ folderName }}<br />
    {{ folderCount }} -->
    <a
      class="btn-link btn d-flex align-items-center border-bottom py-3 text-left"
      :class="{
        active: isActive
      }"
      @click.prevent
      href="#"
    >
      <i class="far fa-folder"></i>
      <span class="pl-3">{{ folderName }}</span>
      <span class="badge badge-secondary ml-auto">{{ folderCount }}</span>
    </a>
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
a.active {
  background: rgb(178, 207, 245);
  .fa-folder:before {
    content: '\f07c';
  }
}
a:hover:not(.active) {
  background: #eee;
}
</style>
