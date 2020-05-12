<template>
  <a
    class="d-flex align-items-center border-bottom py-2"
    @click.prevent
    href="#"
  >
    <i class="fas fa-folder"></i>
    <span class="pl-3">{{ folder.name }}</span>
  </a>
</template>

<script>
export default {
  name: 'FolderItem',
  props: ['folder']
};
</script>

<style scoped lang="scss"></style>
