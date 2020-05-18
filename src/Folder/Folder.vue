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
      selectedFolder: this.all
    };
  },
  components: {
    FolderList,
    FolderContent
  },
  methods: {
    handleGetFolderContent(val) {
      if (val.id === 0) {
        this.selectedFolder = this.unclassified;
      } else {
        this.selectedFolder = val;
      }
    },
    handleFixedFolderClick(val) {
      if (val.id === 'all') {
        this.selectedFolder = this.all;
      }
      // if (val.id === 'unclassified') {
      //   this.selectedFolder = this.unclassified;
      // }
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
