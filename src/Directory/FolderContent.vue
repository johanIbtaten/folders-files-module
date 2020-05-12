<template>
  <div>
    <div class="text-center">
      <button class="btn btn-outline-secondary float-right">
        <i class="fas fa-cog"></i>
      </button>
      <h4>{{ __('Toutes les campagnes') }}</h4>
    </div>
    <div class="text-center mb-3">
      <slot name="link"></slot>
    </div>
    <div class="mb-4">
      <label class="form-control form-control-search">
        <input
          type="text"
          placeholder="Rechercher dans les campagnes"
          v-model="inputVal"
        />
        <i class="fas fa-search"></i>
      </label>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Directory',
  props: ['inputSearch'],

  computed: {
    inputVal: {
      get() {
        return this.inputSearch;
      },
      set(val) {
        this.$emit('items-search', val);
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>
