<template>
    <ScrollView orientation="horizontal">
        <StackLayout orientation="horizontal">
            <Button v-for="control in this.$store.getters.getAdminControls"
                :key="control.id"
                :text="control.text"
                @tap="onTap(control)">
            </Button>
        </StackLayout>
    </ScrollView>
</template>

<script>
export default {
  name: 'BottomBar',
  methods: {
    onTap(control) {
      if ([0, 1, 2, 3].indexOf(control.id) !== -1) {
        this.$store.commit('resetMuteIcon');
      }

      return control.callback();
    },
  },
};
</script>
<style scoped>
ScrollView
{
    margin: 1dp 0dp;
    padding: 2dp 8dp;
}

Button
{
    margin: auto;
    padding: auto;
    opacity: 0.6;
    font-size: 18sp;
    font-weight: bold;
    color: cornflowerblue;
}
</style>
