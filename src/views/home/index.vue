<template>
	<div>
		<el-button @click="changeLanguage">{{$t('index.btn')}}</el-button>

		<p>{{$t('index.title')}}</p>

		<p><a href="#/main">Main</a></p>
	</div>
</template>

<script>
	import Cookie from 'js-cookie'

	export default {
		name: 'home',
		data() {
			return {
			}
		},
		methods: {
			// 语言切换
			changeLanguage() {
				this.$i18n.locale = this.$i18n.locale === 'en' ? 'zh' : 'en';
				Cookie.set('language', this.$i18n.locale);
			},
		},
		created() {
		},
	}
</script>

<style lang="scss" scoped>

</style>
