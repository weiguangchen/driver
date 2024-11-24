<template>
	<uv-parse :content="content"></uv-parse>
</template>

<script setup>
	import { ref } from 'vue'
	import { GetProtocolList } from '@/api/index.js'
	import { onLoad } from '@dcloudio/uni-app'
	
	onLoad((options) => {
		console.log(options)
		getInfo(options.type)
	})
	
	const content = ref()
	async function getInfo(type) {
		const res = await GetProtocolList({
			type
		})
		content.value = res?.[0]?.Content ?? '';
	}
</script>

<style>
	       
</style>
