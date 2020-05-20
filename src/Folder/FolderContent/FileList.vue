<template>
  <div>
    <table class="table-custom table" v-if="list.length > 0">
      <thead>
        <tr>
          <th></th>
          <slot name="filesheader"></slot>
        </tr>
      </thead>
      <draggable
        tag="tbody"
        v-model="dragFiles"
        v-bind="dragFilesOptions"
        @start="onStart"
        @end="onEnd"
      >
        <tr v-for="file in list" :key="file.id" ref="file">
          <td>
            <button class="btn btn-link mr-1 drag-file" data-drag-file>
              <i class="fas fa-bars"></i>
            </button>
          </td>
          <slot name="file" :file="file"></slot>
        </tr>
      </draggable>
    </table>
    <div class="pt-2 pb-3" v-else>{{ __('Pas de campagnes') }}</div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'FileList',
  props: ['list'],
  components: {
    draggable
  },
  computed: {
    dragFiles: {
      get() {
        return this.list;
      },
      set() {}
    },
    dragFilesOptions() {
      return {
        animation: 150,
        group: {
          name: 'files',
          put: false,
          pull: true
        },
        sort: false,
        /* Permet le retour de l'item à sa position initiale si l'on
        relâche le drag en dehors de la liste de destination */
        revertOnSpill: true,
        onSpill: function(evt) {
          evt.item;
        },
        handle: '[data-drag-file]',
        chosenClass: 'chosen', // Class name for the chosen item
        dragClass: 'drag', // Class name for the dragging item
        ghostClass: 'ghost', // Class name for the drop placeholder
        forceFallback: true // Key to make autoScroll works
      };
    }
  },
  methods: {
    onStart() {
      this.$root.$emit('start-drag-file');
    },
    onEnd() {
      this.$root.$emit('end-drag-file');
    }
  }
};
</script>

<style lang="scss">
.chosen {
  // background: red;
}

.ghost {
  // background: greenyellow;
}

.drag {
  opacity: 1 !important;
  background: white !important;
  border: 6px solid gray !important;
  width: 300px !important;
  height: 80px !important;
  display: flex;
  align-items: center;
  cursor: move;
  td {
    display: none;
  }
  td:nth-child(1),
  td:nth-child(2) {
    display: inline;
    border: none !important;
    background: transparent !important;
  }
}

.drag:after {
  // content:"sdsdf";
  // opacity: 1;
  // visibility: visible;
  // position: absolute;
  // top: 0;
  // left: 0;
  // width: 100%;
  // height: 100%;
  // border: 3px solid blue;
}

.drag-file {
  cursor: move;
}
</style>
