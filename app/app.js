import Vue from "nativescript-vue";
// import VueDevtools from 'nativescript-vue-devtools'

import Home from "./components/Home";


if(TNS_ENV !== 'production') {
    // Vue.use(VueDevtools, { host: '192.168.1.76' });
    // Prints Vue logs when --env.production is *NOT* set while building
    Vue.config.silent = false;
} else {
    Vue.config.silent = true;
}


new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    }

}).$start();
