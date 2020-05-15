<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-3">
        <FolderList
          :folders="folders"
          :all="all"
          :unclassified="unclassified"
          :selectedFolder="selectedFolder"
        ></FolderList>
      </div>
      <div class="col-9">
        <FolderContent :selectedFolder="selectedFolder">
          <template slot="title">
            <slot name="title"></slot>
          </template>
          <template slot="link">
            <slot name="link"></slot>
          </template>
          <template slot="content">
            <slot name="content"></slot>
          </template>
        </FolderContent>
      </div>
    </div>
  </div>
</template>

<script>
import FolderList from './FolderList/FolderList';
import FolderContent from './FolderContent/FolderContent';

export default {
  name: 'Folder',
  props: ['folders', 'files', 'all', 'unclassified'],
  data() {
    return {
      selectedFolder: { id: 'all', name: this.all }
    };
  },
  components: {
    FolderList,
    FolderContent
  },
  methods: {
    handleGetFolderContent(val) {
      this.selectedFolder = val;
    },
    handleFixedFolderClick(val) {
      if (val === 'all') {
        this.selectedFolder = { id: 'all', name: this.all };
      }
      if (val === 'unclassified') {
        this.selectedFolder = { id: 'unclassified', name: this.unclassified };
      }
    }
  },
  mounted() {
    this.$root.$on('get-folder-content', this.handleGetFolderContent);
    this.$root.$on('fixed-folder-click', this.handleFixedFolderClick);
  }
};
</script>

<style scoped lang="scss">
/deep/ a:hover {
  text-decoration: none;
}
</style>
