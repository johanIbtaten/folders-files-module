<template>
  <!-- La class js-is-draggable doit être présente pour que l'item soit draggable -->
  <div class="c-folder-list" :class="{ 'js-is-draggable': isDraggable }" @click="handleFolderClick">
    <!-- On crée une liste draggable vide pour chaque item folder.
    Elle recouvre l'item folder. C'est à l'intérieur que l'on pourra dropper des files.
    Elle est bindé avec le tableau d'objets foldercontent.
    Quand le tableau foldercontent est modifié à cause d'une opération de drag and drop
    l'event change est appelé.
    -->
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
      <!-- Composant d'un item de folder  -->
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
          // On peut mettre des objets d'une liste draggable qui a un name files
          put: ['files']
        },
        forceFallback: true
      };
    },
    isActive() {
      return this.selectedFolder.id === this.folder.id;
    },
    // le folder qui a le name unclassified n'est pas draggable
    isDraggable() {
      return this.folder.name !== 'unclassified';
    }
  },
  methods: {
    handleFolderClick() {
      this.$root.$emit('get-folder-content', this.folder);
    },
    // Quand on drop un file dans la liste du folder
    changeFolder(event) {
      // Si un file est ajouté
      if (event.added) {
        /* 
        On construit un objet avec le folder, l'id du file qui vient
        d'être ajouté, le selectedFolder      
        */

        let payload = {
          toFolder: this.folder,
          fileId: event.added.element.id,
          selectedFolder: this.selectedFolder
        };
        // On emit un event file-dropped avec le payload
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

// On affiche la dropZone seulement pour les folder qui ne sont pas actifs
// pour ne pas qu'il puisse se dropper des files à lui-même
.drag-file .dropZoneFile:not(.active) {
  display: block;
}
</style>
