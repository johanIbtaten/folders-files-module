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
    <div class="pt-2 pb-3" v-else>Pas de campagnes</div>
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
      set(value) {
        console.log('value', value); ///////////////////////////
      }
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
        revertOnSpill: true,
        onSpill: function(evt) {
          evt.item;
        },
        handle: '[data-drag-file]',
        chosenClass: 'chosen',
        dragClass: 'drag',
        forceFallback: true // Key to make autoScroll works
      };
    }
  },
  methods: {
    onStart(event) {
      console.log('start');
      console.log(event);
      console.log(event.item.clientWidth);
      //console.log(this.$refs.file.clientWidth);
      //console.log(this.$refs.file);
      this.$root.$emit('start-drag-file');
    },
    onEnd() {
      console.log('end');
      this.$root.$emit('end-drag-file');
    }
  }
};
</script>

<style lang="scss">
/*.chosen {
  background: green !important;
  /* width:300px;
  background: pink !important;
  //td:nth-child(2) {
  td {
    background: red !important;
    display: none !important;
  }
  opacity: 0;
} */

.ghost {
}

.drag {
  background: burlywood !important;
  border: none !important;
  width: 350px !important;
  //display: inline-block;
  display: flex;
  align-items: center;
  padding: 15px;
  td {
    display: none;
  }

  td:nth-child(1),
  td:nth-child(3) {
    display: block;
    border: none !important;
  }
}

/* .sortable-gost td {
  background: pink  !important;
  display: none;
} */

/* tr td:nth-child(2) {
  background: pink  !important;
  display: block !important;
} */

/* .chosen:after {
  opacity: 1;
  visibility: visible;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid blue;
} */

.drag-file {
  cursor: move;
}
</style>
