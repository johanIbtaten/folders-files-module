<template>
  <div>
    <table class="table-custom table">
      <thead>
        <tr>
          <slot name="filesheader"></slot>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <slot name="file" :item="item"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: ['list']
};
</script>
