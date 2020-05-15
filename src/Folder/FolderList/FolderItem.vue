<template>
  <div class="c-folder-list">
    <!-- <div class="overlay"></div> -->
    <draggable
      v-bind="dragDropFileOptions"
      v-model="foldercontent"
      class="dropZoneFile"
      :class="{
        active: isActive
      }"
      @end="endFolder"
      @change="changeFolder"
    ></draggable>
    <div @click.prevent="handleFolderClick">
      <FolderItemLink
        :folder="folder"
        :selectedFolder="selectedFolder"
      ></FolderItemLink>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import FolderItemLink from './FolderItemLink';

export default {
  name: 'FolderItem',
  props: ['folder', 'selectedFolder'],
  components: {
    draggable,
    FolderItemLink
  },
  data() {
    return {
      foldercontent: []
    };
  },
  computed: {
    dragDropFileOptions() {
      return {
        animation: 150,
        group: {
          name: 'files',
          put: ['files']
        },
        // revertOnSpill: true, // Enable plugin
        // // Called when item is spilled
        // onSpill: function(evt) {
        //   evt.item
        // },
        forceFallback: true // Key to make autoScroll works
      };
    },
    isActive() {
      return this.selectedFolder.id === this.folder.id;
    }
  },
  methods: {
    handleFolderClick() {
      this.$root.$emit('get-folder-content', this.folder);
    },
    endFolder(event) {
      console.log('endFolder', event);
    },
    changeFolder(event) {
      console.log('changeFolder', event);
      if (event.added) {
        let payload = {
          folderId: this.folder.id,
          fileId: event.added.element.id
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
  //background: pink;
  opacity: 0;
  z-index: 1;
  display: none;
  cursor: crosshair;
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
