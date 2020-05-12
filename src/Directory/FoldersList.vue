<template>
  <draggable>
    <FolderItem
      v-for="folder in filteredFolder"
      :key="folder.id"
      :folder="folder"
    ></FolderItem>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import FolderItem from './FolderItem';

export default {
  name: 'FoldersList',
  props: ['filteredFolder'],
  components: {
    FolderItem,
    draggable
  }
};
</script>

<style scoped lang="scss"></style>
