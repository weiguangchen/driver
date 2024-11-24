<template>
	<web-view :src="src"></web-view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	
	const src = ref();
	
	onLoad((options) => {
		console.log('src',decodeURIComponent(options.src))
		src.value = decodeURIComponent(options.src);
	})
</script>

<style>

</style>