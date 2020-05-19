<template>
  <div>
    <slot name="content" :filteredFiles="filteredFiles"></slot>
  </div>
</template>

<script>
import { deburr } from 'lodash';

export default {
  name: 'FolderContent',
  props: ['search', 'files', 'unclassifiedFiles', 'selectedFolder'],
  computed: {
    filteredFiles() {
      let files = this.files;
      if (this.selectedFolder && this.selectedFolder !== 'all') {
        if (this.selectedFolder.name === 'unclassified') {
          return this.unclassifiedFiles;
        } else {
          files = files.filter(file => {
            return this.selectedFolder.items.includes(file.id);
          });
        }
      }

      if (this.search) {
        return files.filter(file => {
          return deburr(file.name.toLowerCase()).match(
            deburr(this.search.toLowerCase())
          );
        });
      }
      return files;
    }
  }
};
</script>

<style scoped lang="scss"></style>
