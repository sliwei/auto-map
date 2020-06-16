import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			meta: {title: 'home'},
			component: () => import(/* webpackChunkName: "Home" */ '@/components/Layout'),
			children: [
				{
					path: '',
					name: 'homePage',
					component: () => import(/* webpackChunkName: "HomePage" */ '@/views/home'),
				},
			]
		},
		{
			path: '/main',
			name: 'main',
			meta: {title: 'main'},
			component: () => import(/* webpackChunkName: "Main" */ '@/components/Layout'),
			children: [
				{
					path: '',
					name: 'mainPage',
					component: () => import(/* webpackChunkName: "MainPage" */ '@/views/main'),
				},
			]
		},
		{
			path: '/expenses',
			name: 'expensesPage',
			meta: {title: 'expenses'},
			component: () => import(/* webpackChunkName: "ExpensesPage" */ '@/views/expenses'),
		},
		{
			path: '/expenses-total',
			name: 'expensesTotal',
			meta: {title: 'expenses'},
			component: () => import(/* webpackChunkName: "ExpensesPage" */ '@/views/expenses/total'),
		},

	]
})
