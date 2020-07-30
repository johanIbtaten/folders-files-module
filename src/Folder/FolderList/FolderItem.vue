<template>
  <div
    class="c-folder-list"
    :class="{ 'js-is-draggable': isDraggable }"
    @click="handleFolderClick"
  >
    <draggable
      v-bind="dropFileZoneOptions"
      v-model="foldercontent"
      class="dropZoneFile"
      :class="{
        active: isActive
      }"
      @change="changeFolder"
    ></draggable>
    <div>
      <FolderItemLink
        :folder="folder"
        :selectedFolder="selectedFolder"
        :unclassified="unclassified"
        :unclassifiedCount="unclassifiedCount"
      ></FolderItemLink>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import FolderItemLink from './FolderItemLink';

export default {
  name: 'FolderItem',
  props: ['folder', 'selectedFolder', 'unclassified', 'unclassifiedCount'],
  components: {
    draggable,
    FolderItemLink
  },
  data() {
    return {
      foldercontent: [],
      draggable: true
    };
  },
  computed: {
    dropFileZoneOptions() {
      return {
        animation: 150,
        group: {
          name: 'files',
          put: ['files']
        },
        forceFallback: true
      };
    },
    isActive() {
      return this.selectedFolder.id === this.folder.id;
    },
    isDraggable() {
      return this.folder.name !== 'unclassified';
    }
  },
  methods: {
    handleFolderClick() {
      this.$root.$emit('get-folder-content', this.folder);
    },
    changeFolder(event) {
      if (event.added) {
        let payload = {
          toFolder: this.folder,
          fileId: event.added.element.id,
          selectedFolder: this.selectedFolder
        };
        this.$root.$emit('file-dropped', payload);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.c-folder-list {
  position: relative;
}

.dropZoneFile {
  height: 100%;
  width: 100%;
  position: absolute;
  // background: pink;
  opacity: 0.2;
  z-index: 1;
  display: none;
}

.dropZoneFile:hover {
  opacity: 0.5;
  background: rgba(49, 153, 250, 0.1);
  border: 3px solid rgba(49, 153, 250, 0.5);
}

.drag-file .dropZoneFile:not(.active) {
  display: block;
}
</style>
