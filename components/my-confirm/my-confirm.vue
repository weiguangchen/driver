<template>
	<root-portal>
		<my-modal 
			ref="modal" 
			:title="innerTitle" 
			:content="innerContent" 
			:show-cancel-button="innerShowCancelButton"
			:cancel-text="innerCancelText" 
			:cancel-color="innerCancelColor"
			:show-confirm-button="innerShowConfirmButton"
			:confirm-text="innerConfirmText"
			:confirm-color="innerConfirmColor"
			:confirm-bg-color="innerConfirmBgColor"
			:button-reverse="innerButtonReverse"
			:async-close="innerAsyncClose"
			:close-on-click-overlay="innerCloseOnClickOverlay"
			@confirm="confirmHandler"
			@cancel="cancelHandler"
			@close="closeHandler"
		/>
	</root-portal>
</template>

<script setup>
	import { ref } from 'vue';
	const emits = defineEmits(['confirm', 'cancel', 'close'])
	
	const modal = ref();
	const innerTitle = ref();
	const innerContent = ref();
	const innerShowCancelButton = ref();
	const innerCancelText = ref();
	const innerCancelColor = ref();
	const innerShowConfirmButton = ref();
	const innerConfirmText = ref();
	const innerConfirmColor = ref();
	const innerConfirmBgColor = ref();
	const innerButtonReverse = ref();
	const innerAsyncClose = ref()
	const innerCloseOnClickOverlay = ref();
	const confirmFn = ref();
	const cancelFn = ref();
	const closeFn = ref();
	
	function confirm({
		title,
		content,
		showCancelButton,
		cancelText,
		cancelColor,
		showConfirmButton,
		confirmText,
		confirmColor,
		confirmBgColor,
		buttonReverse,
		asyncClose,
		closeOnClickOverlay,
		confirm,
		cancel,
		close
	}) {
		if(title)
		innerTitle.value = title;
		innerContent.value = content;
		innerShowCancelButton.value = showCancelButton ?? true;
		innerCancelText.value = cancelText ?? '取消';
		innerCancelColor.value = cancelColor;
		innerShowConfirmButton.value = showConfirmButton ?? true;
		innerConfirmText.value = confirmText ?? '好的';
		innerConfirmColor.value = confirmColor;
		innerConfirmBgColor.value = confirmBgColor ?? '#F15948';
		innerButtonReverse.value = buttonReverse ?? false;
		innerAsyncClose.value = asyncClose ?? false;
		innerCloseOnClickOverlay.value = closeOnClickOverlay ?? true;
		confirmFn.value = confirm;
		cancelFn.value = cancel;
		closeFn.value = close;
		modal.value.open();
	}
	function close() {
		modal.value.close();
	}
	function closeLoading() {
		modal.value.closeLoading();
	}
	
	function confirmHandler() {
		emits('confirm')
		if(confirmFn.value) {
			confirmFn.value();
		}
	}
	function cancelHandler() {
		emits('cancel')
		if(cancelFn.value) {
			cancelFn.value();
		}
	}
	function closeHandler() {
		emits('close')
		if(closeFn.value) {
			closeFn.value();
		}
	}
	
	defineExpose({
		confirm,
		close,
		closeLoading
	})
</script>

<style>
</style>