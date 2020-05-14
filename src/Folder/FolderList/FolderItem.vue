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
    <a
      class="d-flex align-items-center border-bottom py-3"
      @click.prevent="handleFolderClick"
      href="#"
    >
      <i class="fas fa-folder"></i>
      <span class="pl-3">{{ folder.name }}</span
      >{{ folder.items }}
      <span class="badge badge-secondary ml-auto">{{
        folder.items.length
      }}</span>
    </a>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'FolderItem',
  props: ['folder'],
  components: {
    draggable
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
    // fileMoved(file) {
    //   console.log(arguments);
    // },
    // startFile(file) {
    //   console.log("startFile", file);
    // },
    handleFolderClick() {
      console.log('this.folder.id', this.folder.id);
      this.$root.$emit('get-folder-content', this.folder.id);
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
  a:hover {
    background: #eee;
  }
}

.dropZoneFile {
  height: 100%;
  width: 100%;
  position: absolute;
  background: pink;
  opacity: 0.4;
  border: 3px solid red;
  z-index: 0;
  pointer-events: none;
}
</style>
