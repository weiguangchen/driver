const STORAGE_KEY = 'ht-device-id'

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/**
 * 获取设备唯一标识，首次调用时自动生成并存入本地 Storage
 * @returns {string} 设备 UUID
 */
export function getDeviceId() {
	let deviceId = uni.getStorageSync(STORAGE_KEY)
	if (!deviceId) {
		deviceId = generateUUID()
		uni.setStorageSync(STORAGE_KEY, deviceId)
	}
	return deviceId
}
