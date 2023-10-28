import { useMutation } from "react-query";
import { 
    deleteProjectQuery, 
    loginQuery, 
    registerQuery, 
    createProjectQuery, 
    joinProjectQuery, 
    leaveProjectQuery, 
    createSubSectionQuery, 
    createNoteQuery,
    deleteNoteQuery,
    createTagQuery,
    deleteSubSectionQuery,
    deleteTagQuery,
    createSourceQuery, //to remove
    } from "../Utils/Queries"; 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { setInvalidError } from "../Utils/Utils";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useMutations = () => {
    const navigate = useNavigate()
    const {user,login} = useAuth()

    const { invalid, setInvalid } = useContext(AuthContext)


    const [deleteProjectMutation, setDeleteProjectMutation] = useState(
        useMutation(deleteProjectQuery,{
            onSuccess: (data) => {
                navigate('/UserHome')
            },
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )
    
    const [loginMutation, setLoginMutation] = useState(
        useMutation(loginQuery, {
            onSuccess: (data) => {
                const user = {token:data.token,id:data.user._id,email:data.user.email,firstName:data.user.firstName,lastName:data.user.lastName}
                login(user)
                navigate('/UserHome')
            },
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [registerMutation, setRegisterMutation] = useState(
        useMutation(registerQuery, {
            onSuccess: (data) => {
                const user = {token:data.token,id:data.newUser._id,email:data.newUser.email,firstName:data.newUser.firstName,lastName:data.newUser.lastName}
                // sessionStorage.setItem('user',JSON.stringify(user))
                login(user)
                navigate('/UserHome')
            },
            onError:(error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [createProjectMutation, setCreateProjectMutation] = useState(
        useMutation(createProjectQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [joinProjectMutation, setJoinProjectMutation] = useState(
        useMutation(joinProjectQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [leaveProjectMutation, setLeaveProjectMutation] = useState(
        useMutation(leaveProjectQuery,{
            onSuccess: (data) => {
                if (!(data.members.includes(user.id))) {
                    navigate('/UserHome')
                }
                else {
                    navigate(0)
                }
            },
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [createSubSectionMutation, setCreateSubSectionMutation] = useState(
        useMutation(createSubSectionQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [createNoteMutation, setCreateNoteMutation] = useState(
        useMutation(createNoteQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )
    const [createTagMutation, setCreateTagMutation] = useState(
        useMutation(createTagQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )
    //to be removed
    const [createSourceMutation, setCreateSourceMutation] = useState(
        useMutation(createSourceQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [deleteNoteMutation, setDeleteNoteMutation] = useState(
        useMutation(deleteNoteQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [deleteSubSectionMutation, setDeleteSubSectionMutation] = useState(
        useMutation(deleteSubSectionQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [deleteTagMutation, setDeleteTagMutation] = useState(
        useMutation(deleteTagQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )
    

    return { deleteProjectMutation, 
        loginMutation,
        createProjectMutation,
        registerMutation, 
        joinProjectMutation, 
        leaveProjectMutation, 
        createSubSectionMutation, 
        createNoteMutation,
        deleteNoteMutation,
        createTagMutation, 
        deleteSubSectionMutation,
        deleteTagMutation,
        createSourceMutation, //to be removed
        invalid }
}