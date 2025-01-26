// src/utils/localStorageUtils.js

export function safeLocalStorageGetItem(key, defaultValue = null) {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		return defaultValue;
	}
}

export function safeLocalStorageSetItem(key, value) {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		console.error(error);
	}
}

export function safeLocalStorageRemoveItem(key) {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(error);
	}
}
