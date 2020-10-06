<template>
    <ActionBar :title="this.title">
        <StackLayout orientation="horizontal">
            <Button :class="{'admin': this.$store.getters.isAdminMode, 'no-admin': true}"
                :text="this.title"
                @tap="onTap">
            </Button>
            <ActivityIndicator :busy="this.$store.getters.isLoading"
                :color="(this.$store.getters.isPowerOn === true) ? 'cornflowerblue' : 'gray'">
            </ActivityIndicator>
            <Switch isUserInteractionEnabled="false"
                :checked="this.$store.getters.isPowerOn"
                :color="(this.$store.getters.isPowerOn === true) ? 'cornflowerblue' : 'gray'">
            </Switch>
        </StackLayout>
    </ActionBar>
</template>

<script>
export default {
  name: 'TopBar',
  data() {
    return {
      title: 'Music Cast',
    };
  },
  methods: {
    onTap() {
      if (this.$store.getters.isLoading === true) return;

      // set activity indicator to busy
      this.$store.commit('setLoading', true);

      this.$store.commit('setSearchPhrase', '');
      this.$store.commit('setAdminMode', !this.$store.getters.isAdminMode);
    },
  },
};
</script>

<style scoped>
ActionBar
{
    background-image: linear-gradient(to right, black, firebrick);
}

Button
{
    background: rgba(0, 0, 0, 0.01);
    margin: 8dp 28dp;
    padding: 8dp;
    font-size: 28sp;
    font-weight: bold;
    letter-spacing: 0.1em;
    border: none;
}

.no-admin
{
    color: antiquewhite;
}

.admin
{
    color: cornflowerblue;
}

ActivityIndicator
{
    margin-right: 28dp;
    padding: auto;
}

Switch
{
    margin-right: 28dp;
    padding: auto;
}
</style>
