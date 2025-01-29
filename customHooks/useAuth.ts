import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useUser } from './useUser';
import { LoginPayload } from '../types';

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { user, addUser, removeUser } = useUser();
	const { getItem, removeItem } = useLocalStorage();
	useEffect(() => {
		try {
			const sessionStorageUser:LoginPayload = getItem('user');
			const decodedToken = jwt_decode<JwtPayload>(sessionStorageUser.token);
			const dateNow = new Date();
			if (decodedToken.exp && !(decodedToken.exp * 1000 < dateNow.getTime())) {
				addUser(sessionStorageUser);
			} else {
				logout();
			}
		} catch (error: any) {
			// console.log("Error fetching local storage item: ", error.message)
		}
		
		setIsLoading(false);
	}, []);

	const login = (user:LoginPayload) => {
		addUser(user);
	};
	const logout = () => {
		removeUser();
	};

	return { user, login, logout, isLoading };
};
