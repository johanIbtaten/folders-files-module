<template>
  <div>
    <table class="table-custom table" v-if="list.length > 0">
      <thead>
        <tr>
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
        <tr v-for="item in list" :key="item.id">
          <slot name="file" :item="item"></slot>
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
  data() {
    return {
      //listFiles: this.list
    };
  },
  computed: {
    dragFiles: {
      get() {
        //console.log('listFiles', this.listFiles);
        return this.list;
      },
      set(value) {
        console.log('value', value); ///////////////////////////
        //this.$root.$emit('folder-move', value);
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
        forceFallback: true // Key to make autoScroll works
        //handle: '[data-drag-category]',
      };
    }
  },
  methods: {
    onStart() {
      console.log('start');
      this.$root.$emit('start-drag-file');
    },
    onEnd() {
      console.log('end');
      this.$root.$emit('end-drag-file');
    }
  }
};
</script>
