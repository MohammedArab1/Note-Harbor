import {useEffect, useState} from 'react'
import { useUser } from './useUser'
import { useLocalStorage } from './useLocalStorage'
import jwt_decode from "jwt-decode"

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { user, addUser, removeUser } = useUser()
  const { getItem, removeItem } = useLocalStorage()

  useEffect(() => {
    const user = getItem('user')
    if (user) {
      const decodedToken = jwt_decode(user.token);
      const dateNow = new Date();
      if (!(decodedToken.exp*1000 < dateNow.getTime())) {
        addUser(user)
      }
      else {
        removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (user) => {
    addUser(user)
  }
  const logout = () => {
    removeUser();
  }

  return { user, login, logout, isLoading }
}