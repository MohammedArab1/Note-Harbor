import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
	createCommentQuery,
	createNoteQuery,
	createProjectQuery,
	createSubSectionQuery,
	createTagQuery,
	deleteNoteQuery,
	deleteProjectQuery,
	deleteSubSectionQuery,
	deleteTagQuery,
	joinProjectQuery,
	leaveProjectQuery,
	loginQuery,
	registerQuery,
	updateTagNoteQuery,
	updateNoteQuery
} from '../Utils/Queries';
import { setInvalidError } from '../Utils/Utils';
import { useAuth } from './useAuth';
import { LoginPayload, Result, ErrorPayload } from '../types';
import { useLocalStorage } from './useLocalStorage';

export const useMutations = () => {
	const navigate = useNavigate();
	const { user, login } = useAuth();
	const { setItem } = useLocalStorage();

	const { invalid, setInvalid } = useContext(AuthContext);

	const [deleteProjectMutation, setDeleteProjectMutation] = useState(
		useMutation(deleteProjectQuery, {
			onSuccess: (data) => {
				navigate('/UserHome');
			},
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [loginMutation, setLoginMutation] = useState(
		useMutation(loginQuery, {
			onSuccess: (result) => {
				console.log("onsuccess")
					const user:LoginPayload  = {
						token: result.token,
						user:result.user
					};
					login(user);
					setItem('offlineMode', false)
					navigate('/UserHome');
			},
			onError: (error:ErrorPayload) => {
				console.log("in on error: ", error)
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [registerMutation, setRegisterMutation] = useState(
		useMutation(registerQuery, {
			onSuccess: (result) => {
				const user: LoginPayload = {
					token: result.token,
					user:result.user
				};
				login(user);
				setItem('offlineMode', false)
				navigate('/UserHome');
			},
			onError: (error:ErrorPayload) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [createProjectMutation, setCreateProjectMutation] = useState(
		useMutation(createProjectQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [joinProjectMutation, setJoinProjectMutation] = useState(
		useMutation(joinProjectQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [leaveProjectMutation, setLeaveProjectMutation] = useState(
		useMutation(leaveProjectQuery, {
			onSuccess: (data) => {
				if (!data.members.includes(user.id)) {
					navigate('/UserHome');
				} else {
					navigate(0);
				}
			},
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [createSubSectionMutation, setCreateSubSectionMutation] = useState(
		useMutation(createSubSectionQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [createNoteMutation, setCreateNoteMutation] = useState(
		useMutation(createNoteQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);
	const [createTagMutation, setCreateTagMutation] = useState(
		useMutation(createTagQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [updateTagNoteMutation, setUpdateTagNoteMutation] = useState(
		useMutation(updateTagNoteQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [createCommentMutation, setCreateCommentMutation] = useState(
		useMutation(createCommentQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [deleteNoteMutation, setDeleteNoteMutation] = useState(
		useMutation(deleteNoteQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [deleteSubSectionMutation, setDeleteSubSectionMutation] = useState(
		useMutation(deleteSubSectionQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [deleteTagMutation, setDeleteTagMutation] = useState(
		useMutation(deleteTagQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	const [updateNoteMutation, setUpdateNoteMutation] = useState(
		useMutation(updateNoteQuery, {
			onError: (error) => {
				setInvalidError(setInvalid, error);
			},
		})
	);

	return {
		deleteProjectMutation,
		loginMutation,
		createProjectMutation,
		registerMutation,
		joinProjectMutation,
		leaveProjectMutation,
		createSubSectionMutation,
		createNoteMutation,
		deleteNoteMutation,
		createTagMutation,
		updateTagNoteMutation,
		deleteSubSectionMutation,
		deleteTagMutation,
		createCommentMutation,
		updateNoteMutation,
		invalid,
		setInvalid
	};
};
