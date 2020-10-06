<template>
    <SearchBar hint="Music is the key..."
        v-model="searchPhrase">
    </SearchBar>
</template>

<script>
export default {
  name: 'FileSearchBar',
  computed: {
    searchPhrase: {
      get() { return this.$store.getters.getSearchPhrase; },
      set(value) { this.$store.commit('setSearchPhrase', value); },
    },
  },
};
</script>

<style scoped>
SearchBar
{
    font-size: 18sp;
    letter-spacing: 0.1em;
    opacity: 0.6;
}
</style>
