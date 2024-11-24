export const tokenKey = process.env.TOKEN_KEY;

export function setToken(data) {
	return uni.setStorageSync(tokenKey, data)
}
export function getToken() {
	return uni.getStorageSync(tokenKey)
}
export function removeToken() {
	return uni.removeStorageSync(tokenKey)
}

