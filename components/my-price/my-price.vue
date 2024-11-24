<template>
	<text class="my-price">
		<text class="symbol">￥</text>
		<text class="int">34</text>
		<text class="dec">.00</text>
	</text>
</template>

<script>
</script>

<style lang="scss" scoped>
	.my-price {
		display: inline-flex;
		align-items: flex-end;
		font-family: misans;
	}
	.symbol,.dec {
		font-size: 24rpx;
	}
	.int {
		font-size: 40rpx;
	}
</style>