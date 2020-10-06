<template>
    <Page>
        <TopBar></TopBar>
        <StackLayout orientation="vertical">
            <FileSearchBar></FileSearchBar>
            <FileList></FileList>
            <BottomBar></BottomBar>
        </StackLayout>
    </Page>
</template>

<script>
import controller from '../controllers/controller';

import TopBar from './otherComponents/TopBar.vue';
import FileSearchBar from './otherComponents/FileSearchBar.vue';
import FileList from './otherComponents/FileList.vue';
import BottomBar from './otherComponents/BottomBar.vue';

export default {
  components: {
    TopBar,
    FileSearchBar,
    FileList,
    BottomBar,
  },
  data() {
    return {
      timer: undefined,
    };
  },
  methods: {
    async checkStatus() {
      try {
        this.$store.commit('setNetwork', await controller.isNetworkOn());
        if (this.$store.getters.isNetworkOn !== true) {
          throw new Error('Network is unavailable...');
        }
        this.$store.commit('setPower', await controller.isPowerOn());
        this.timer = setTimeout(this.checkStatus, 3000);
      } catch (e) {
        console.log(`App: ${e}`);
        this.$store.commit('setNetwork', false);
        this.$store.commit('setPower', false);
        await alert({
          title: 'Network is unavailable...',
          message: 'Network is unavailable at the moment. Please choose CONNECT to try again.',
          okButtonText: 'CONNECT',
        });
        this.timer = setTimeout(this.checkStatus, 1000);
      }
    },
  },
  mounted() {
    if (this.timer === undefined) {
      this.timer = setTimeout(this.checkStatus, 1000);
    }
  },
};
</script>

<style scoped>
Page
{
    width: 100%;
    heigth: 100%;
    font-family: "FontAwesome";
    color: antiquewhite;
}

TopBar
{
    width: 100%;
    heigth: 16%;
}

StackLayout
{
    width: 100%;
    heigth: 84%;
}

FileSearchBar
{
    width: 100%;
    heigth: 12%;
}

FileList
{
    width: 100%;
    heigth: 60%;
}

BottomBar
{
    width: 100%;
    heigth: 12%;
}
</style>
