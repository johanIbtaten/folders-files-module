<template>
<div class="snippet-item snippet-row mb-2 mt-2 pb-2">
    <div class="snippet-container">
      <div class="block-title">
        <button class="btn btn-link mr-1" data-drag-snippet>
          <i class="fas fa-bars"></i>
        </button>
        <strong>{{ __('snippet.title') }}</strong>
      </div>

      <div class="ml-auto btn-container">
        <div class="btn-group" v-show="!editing">
          <button class="btn btn-outline-danger" @click="deleteSnippet()">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-secondary" @click="editing = !editing">
            {{ __('modifier') }}
          </button>
        </div>
      </div>
    </div>
  <tr>
    <slot name="folderfile">Default</slot>
  </tr>
</template>

<script>

export default {
  name: 'FolderFile'
};
</script>

<style scoped lang="scss"></style>
