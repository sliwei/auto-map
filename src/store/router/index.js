export default {
	state: {
		arr: [],
		cacheArr: [],
	},
	mutations: {
		ADD_TABS(state, router) {
			let list = state.arr;
			if (list.some(item => item.path === router.path || router.name === 'homePage')) return;
			state.arr.push(router);
			!router.meta.nocache && state.cacheArr.push(router.name);
		},
	},
	actions: {
		addTabs(ctx, router) {
			ctx.commit("ADD_TABS", router);
		},
	},
}
