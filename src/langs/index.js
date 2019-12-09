import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import ElementEn from 'element-ui/lib/locale/lang/en'
import ElementZh from 'element-ui/lib/locale/lang/zh-CN'
// Custom locales
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n);

const messages = {
	en: {
		...enLocale,
		...ElementEn
	},
	zh: {
		...zhLocale,
		...ElementZh
	}
};

const i18n = new VueI18n({
	locale: Cookie.get('language') || 'zh',
	messages
});

export default i18n
