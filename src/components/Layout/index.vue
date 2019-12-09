<template>
	<div class="layout">
		<div>
			{{$t('layout.a')}}<span style="color: green">{{$t('layout.b')}}</span>
		</div>
		<br>
		<keep-alive :include="cacheArr">
			<router-view :key="key"/>
		</keep-alive>
	</div>
</template>

<script>

	export default {
		name: 'layout',
		computed: {
			key() {
				return this.$route.name
			},
			cacheArr() {
				return this.$store.state.router.cacheArr
			},
		},
	}
</script>

<style lang="less" scoped>
	.layout {
		text-align: center;
		padding-top: 50px;
	}
</style>
