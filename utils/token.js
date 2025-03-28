export const tokenKey = process.env.TOKEN_KEY;

export async function setToken(data) {
	try {
		await uni.setStorageSync(tokenKey, data)
	}catch (error) {
		console.log('setToken error',error)
	}
}
export function getToken() {
	return uni.getStorageSync(tokenKey)
}
export function removeToken() {
	return uni.removeStorageSync(tokenKey)
}

