<template>
    <ScrollView orientation="vertical" height=82%>
        <StackLayout orientation="vertical">
            <Button v-for="file in this.files"
                :key="file.id"
                v-show="$store.getters.isNetworkOn && isMatched(file)"
                :text="file.text"
                textWrap="true"
                :style="getColor(file)"
                @tap="onTap(file)">
            </Button>
        </StackLayout>
    </ScrollView>
</template>

<script>
import controller from '../../controllers/controller';

export default {
  name: 'FileList',
  data() {
    return {
      actualFiles: [],
      cachedFiles: [],
      files: [],
    };
  },
  computed: {
    isPowerOn: {
      get() { return this.$store.getters.isPowerOn; },
      set(value) { this.$store.commit('setPower', value); },
    },
    isAdminMode: {
      get() { return this.$store.getters.isAdminMode; },
      set(value) { this.$store.commit('setAdminMode', value); },
    },
  },
  updated() {
    // set activity indicator to free again
    this.$store.commit('setLoading', false);
  },
  watch: {
    isPowerOn(newValue) {
      // set activity indicator to busy
      this.$store.commit('setLoading', newValue);

      // reset the search field
      this.$store.commit('setSearchPhrase', '');

      if (this.$store.getters.isAdminMode === true) {
        // set activity indicator to busy
        this.$store.commit('setLoading', false);
      } else {
        this.listFiles();
      }
    },
    isAdminMode(newValue) {
      if (newValue === true) {
        this.actualFiles = this.files;
        this.files = this.$store.getters.getAdminControls;
      } else {
        this.files = this.actualFiles;
      }
    },
  },
  methods: {
    async listFiles() {
      const pwd = await controller.pwd();
      const anyCachedFiles = this.cachedFiles.filter((ls) => ls.menu_layer === pwd.menu_layer
        && ls.menu_name === pwd.menu_name);
      if (anyCachedFiles.length !== 0) {
        console.log('CACHED');
        this.files.splice(0, this.files.length);
        anyCachedFiles[0].list_info.map((file) => this.files.push(file));
        return;
      }

      console.log('NOT CACHED');
      const ls = await controller.ls();
      this.files.splice(0, this.files.length);
      ls.list_info.map((file) => this.files.push(file));
      this.cachedFiles.push(ls);
    },
    async onTap(file) {
      if (this.$store.getters.isLoading === true) return;

      // set activity indicator to busy
      this.$store.commit('setLoading', true);

      if (file.callback !== undefined) {
        if ([0, 1, 2, 3].indexOf(file.id) !== -1) {
          this.$store.commit('resetMuteIcon');
        }

        await file.callback();

        // set activity indicator to free again
        this.$store.commit('setLoading', false);
        return;
      }

      // set activity indicator to free only after rendering is done, see 'updated'
      if (controller.isDirectory(file)) {
        // reset the search field
        this.$store.commit('setSearchPhrase', '');

        await controller.cd(file.id);
        await this.listFiles();
        // rendering... wait until done before setting activity indicator to free again
        return;
      } if (controller.isSoundFile(file)) {
        await controller.playFile(file.id);
      } else {
        await alert({
          title: 'Unable to play...',
          message: 'Unable to play. The file format is not supported.',
          okButtonText: 'OK',
        });
      }

      // set activity indicator to free again
      this.$store.commit('setLoading', false);
    },
    getColor(file) {
      let style;
      if (file.callback !== undefined) {
        style = { color: 'cornflowerblue', fontWeight: 'bold' };
        return style;
      }

      if (controller.isDirectory(file)) {
        style = { color: 'antiquewhite', fontWeight: 'bold' };
      } else if (controller.isSoundFile(file)) {
        style = { color: 'indianred', fontWeight: 'bold' };
      } else {
        style = { color: 'lightgray' };
      }

      return style;
    },
    isMatched(file) {
      return (file.text.toUpperCase()).includes(this.$store.getters.getSearchPhrase.toUpperCase());
    },
  },
};
</script>
<style scoped>
Button
{
    width: 100%;
    padding: 2dp 8dp;
    font-size: 16sp;
    letter-spacing: 0.1em;
}
</style>
