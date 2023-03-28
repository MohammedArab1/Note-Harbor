import axios from 'axios'
import { returnSessionObject } from './Utils'

const baseUrl = 'http://localhost:3001/api'


//The following block of code was meant to act as an interceptor to take responses which contain tokens with updated expiry time and set that
//as the new token in sessionStorage. However, it is not working as intended. Leaving it as is for now and token will simply be 1 hour long. 
// axios.interceptors.response.use(
//   response => {
//     // Retrieve specific information from the response and set it as part of sessionStorage
//     const data = response.data;
//     // console.log("new updated token: ", jwt_decode(data.token))
//     // const user = {token:data.token,id:data.newUser._id,email:data.newUser.email,firstName:data.newUser.firstName,lastName:data.newUser.lastName}
//     // const oldUser = sessionStorage.getItem('user')
//     sessionStorage.setItem('user',JSON.stringify({...returnSessionObject(),token:data.token}))
    
//     // const specificInfo = data.specificInfo; // replace "specificInfo" with the name of the specific information you want to retrieve from the response
//     // sessionStorage.setItem('specificInfo', specificInfo);


// Request interceptors for API calls. This will add the token to the header of every request
axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = returnSessionObject() ? `Bearer ${returnSessionObject().token}` : null
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
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

export const fetchGroupPerUserId = (userId) => {
  return axios.get(`${baseUrl}/group/${userId}`)
  .then(
    res => res.data
  )
}

export const createGroupQuery = (groupObject) => {
  return axios.post(`${baseUrl}/group`, groupObject)
  .then(
    res => res.data
  )
}

export const joinGroupQuery = (groupObject) => {
  return axios.put(`${baseUrl}/group`, groupObject)
  .then(
    res => res.data
  )
}

//todo REMOVE THIS
export const validateTokenExpiryDate = (token) => {
  return axios.get(`${baseUrl}/validate`)
  .then(
    res => res.data
  )
}
