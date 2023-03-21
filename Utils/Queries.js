import axios from 'axios'
import { returnSessionObject } from './Utils'

const baseUrl = 'http://localhost:3001/api'

export const loginQuery = userObject =>{
  return axios.post(`${baseUrl}/login`, userObject)
  .then(
    res => res.data
  )
}
export const registerQuery = userObject => {
  return axios.post(`${baseUrl}/user/register`, userObject)
  .then(
    res => res.data
  )
}

// let reqInstance = axios.create({
//   headers: {
//     authorization : `Bearer ${returnSessionObject().token}`
//     }
//   }
// )

export const fetchGroupPerUserId = (userId) => {
  const config = {
    headers: {
      authorization : `Bearer ${returnSessionObject().token}`
    }
  }
  return axios.get(`${baseUrl}/group/${userId}`,config)
  .then(
    res => res.data
  )
}

export const validateTokenExpiryDate = (token) => {
  const config = {
    headers: {
      authorization : `Bearer ${token}`
    }
  }
  return axios.get(`${baseUrl}/validate`,config)
  .then(
    res => res.data
  )
}
