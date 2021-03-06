import router from './'
import NProgress from 'nprogress'

NProgress.configure({showSpinner: false});

router.beforeEach((to, from, next) => {
	NProgress.start();
	next();
});

router.afterEach(() => {
	NProgress.done()
});
