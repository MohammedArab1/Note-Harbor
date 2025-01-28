import { useState } from 'react';

export const useLocalStorage = () => {
	const [value, setValue] = useState(null);

	const setItem = (key:string, value:any) => {
		localStorage.setItem(key, JSON.stringify(value));
		setValue(value);
	};

	const getItem = (key:string) => {
		const item = localStorage.getItem(key)
		if (item) {
			const value = JSON.parse(item);
			setValue(value);
			return value;
		}
		throw new Error("No item found")
	};

	const removeItem = (key: string): void => {
		localStorage.removeItem(key);
		setValue(null);
	};
	return { value, setItem, getItem, removeItem };
};
