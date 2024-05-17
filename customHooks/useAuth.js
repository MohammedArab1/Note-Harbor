import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useUser } from './useUser';

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { user, addUser, removeUser } = useUser();
	const { getItem, removeItem } = useLocalStorage();
	useEffect(() => {
		const sessionStorageUser = getItem('user');
		if (sessionStorageUser) {
			const decodedToken = jwt_decode(sessionStorageUser.token);
			const dateNow = new Date();
			if (!(decodedToken.exp * 1000 < dateNow.getTime())) {
				addUser(sessionStorageUser);
			} else {
				logout();
			}
		}
		setIsLoading(false);
	}, []);

	const login = (user) => {
		addUser(user);
	};
	const logout = () => {
		removeUser();
	};

	return { user, login, logout, isLoading };
};
