import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocalStorage } from './useLocalStorage';

export const useUser = () => {
	const { user, setUser } = useContext(AuthContext);
	const { setItem,removeItem } = useLocalStorage();

	const addUser = (user) => {
		setUser(user);
		setItem('user', user);
	};

	const removeUser = () => {
		setUser(null);
		// setItem('user', null);
		removeItem("user")
	};

	return { user, addUser, removeUser };
};
