<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-3">
        <FolderList
          :folders="folders"
          :allCampaigns="allCampaigns"
          :unclassifiedCampaigns="unclassifiedCampaigns"
        ></FolderList>
      </div>
      <div class="col-9">
        <FolderContent>
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
//import { deburr } from 'lodash';

import FolderList from './FolderList/FolderList';
import FolderContent from './FolderContent/FolderContent';

export default {
  name: 'Folder',
  props: ['folders', 'files', 'allCampaigns', 'unclassifiedCampaigns'],
  components: {
    FolderList,
    FolderContent
  },
  data() {
    return {
      //searchFiles: ''
    };
  },
  computed: {
    // filteredFiles() {
    //   return this.files.filter(item => {
    //     return deburr(item.name.toLowerCase()).match(
    //       deburr(this.searchItems.toLowerCase())
    //     );
    //   });
    // }
    // sentCampaigns() {
    //   return this.filteredItems.filter(item => {
    //     return item.status === 'sent';
    //   });
    // },
    // draftCampaigns() {
    //   return this.filteredItems.filter(item => {
    //     return item.status === 'draft';
    //   });
    // }
  },
  methods: {
    handleGetFolderContent(val) {
      console.log('handleGetFolderContent', val);
      // this.folderItems = val;
      // if (this.folderItems) {
      //   this.listFiles = this.list.map(file => {
      //     if (this.folderItems.includes(file.id)) {
      //       return file;
      //     }
      //   });
      // }
    }
  },
  created() {
    this.$root.$on('get-folder-content', this.handleGetFolderContent);
  }
};
</script>

<style scoped lang="scss">
/deep/ a:hover {
  text-decoration: none;
}
</style>
