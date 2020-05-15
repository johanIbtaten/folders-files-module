<template>
  <div class="c-folder-list">
    <draggable
      v-bind="dragDropFileOptions"
      v-model="foldercontent"
      class="dropZoneFile"
      @end="endFolder"
      @change="changeFolder"
      >Dropzone</draggable
    >
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
        // dragoverBubble: true,
        forceFallback: true // Key to make autoScroll works
      };
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
  background: pink;
  opacity: 0.4;
  border: 3px solid red;
  z-index: -1;
  display: none;
}

.drag-file .dropZoneFile {
  display: block;
}
</style>
