import { useMutation } from "react-query";
import { deleteGroupQuery, loginQuery, registerQuery, createGroupQuery, joinGroupQuery } from "../Utils/Queries";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { setInvalidError } from "../Utils/Utils";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useMutations = () => {
    const navigate = useNavigate()
    const {login} = useAuth()

    const { invalid, setInvalid } = useContext(AuthContext)


    const [deleteGroupMutation, setDeleteGroupMutation] = useState(
        useMutation(deleteGroupQuery,{
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

    const [createGroupMutation, setCreateGroupMutation] = useState(
        useMutation(createGroupQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    const [joinGroupMutation, setJoinGroupMutation] = useState(
        useMutation(joinGroupQuery, {
            onError: (error) => {
                setInvalidError(setInvalid, error)
            }
        })
    )

    return { deleteGroupMutation, loginMutation,createGroupMutation, registerMutation, joinGroupMutation, invalid }
}