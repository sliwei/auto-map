<template>
	<div>
		main.vue
		<p><a href="#/">Home</a></p>

    <p @click="click">{{ name }}</p>
	</div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class App extends Vue {
		name: number = 123
		str: string = '123'
		str1: string[] = ['123']
		arr: Array<number> = [1,2]
	  x: [number, string] = [1, '2']

    click() {
	    this.name += this.name
	    this.x = [this.name, '1']
	  }
	}
</script>

<style lang="scss" scoped>
</style>
