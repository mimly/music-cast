import Vue from 'vue';
import Vuex from 'vuex';
import controller from './controllers/controller';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isNetworkOn: false,
    isPowerOn: false,
    isLoading: false,
    isAdminMode: false,
    adminControls: [
      { id: 0, text: 'ON', callback: controller.setPowerOn },
      { id: 1, text: 'OFF', callback: controller.setPowerOff },
      { id: 2, text: '➕', callback: controller.increaseVolume },
      { id: 3, text: '➖', callback: controller.decreaseVolume },
      { id: 4, text: '🔊', callback() { this.text = this.text === '🔊' ? '🔇' : '🔊'; controller.toggleMute(); } },
      { id: 5, text: '⏮', callback: controller.previous },
      { id: 6, text: '⏯', callback: controller.togglePlay },
      { id: 7, text: '⏹', callback: controller.stop },
      { id: 8, text: '⏭', callback: controller.next },
    ],
    searchPhrase: '',
  },
  getters: {
    isNetworkOn: (state) => state.isNetworkOn,
    isPowerOn: (state) => state.isPowerOn,
    isLoading: (state) => state.isLoading,
    isAdminMode: (state) => state.isAdminMode,
    getAdminControls: (state) => state.adminControls,
    getSearchPhrase: (state) => state.searchPhrase,
  },
  mutations: {
    setSearchPhrase: (state, value) => {
      state.searchPhrase = value;
    },
    setNetwork: (state, value) => {
      state.isNetworkOn = value;
    },
    setPower: (state, value) => {
      state.isPowerOn = value;
    },
    setLoading: (state, value) => {
      state.isLoading = value;
    },
    setAdminMode: (state, value) => {
      state.isAdminMode = value;
    },
    resetMuteIcon: (state) => {
      state.adminControls.filter((control) => control.id === 4)[0].text = '🔊';
    },
  },
});
