import Vue from "vue";
import Vuex from "vuex";
import router from './router';

Vue.use(Vuex);
const stores = new Vuex.Store({
	modules: {
		router: router,
	},
});

export default stores;
