<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <slot name="folderfile-header"></slot>
        </tr>
      </thead>
      <tbody>
        <FolderFile v-for="item in list" :key="item.id">
          <template slot="folderfile">
            <slot name="folderfile" :item="item"></slot>
          </template>
        </FolderFile>
      </tbody>
    </table>
  </div>
</template>

<script>
import FolderFile from './FolderFile';

export default {
  name: 'CampaignCategoryListing',
  props: ['list'],
  components: {
    FolderFile
  }
};
</script>

<style scoped lang="scss"></style>
