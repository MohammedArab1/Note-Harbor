import axios from 'axios'
import { returnSessionObject } from './Utils'

const baseUrl = 'http://localhost:3001/api'


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

// // Response interceptors for API calls. This will check if the token is expired and redirect to login page if it is
// axios.interceptors.response.use((response) => {
//   return response;
// }, (error) => {
//   if (error.response.data.error === "jwt expired" ) {
//     window.location.href = '/login'
//   }
//   return Promise.reject(error);
// });



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

export const fetchGroupPerUserId = () => {
  return axios.get(`${baseUrl}/group`)
  .then(
    res => res.data
  )
}

export const fetchGroupById = (groupId) => {
  return axios.get(`${baseUrl}/group/${groupId}`)
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

export const deleteGroupQuery = (groupId) => {
  return axios.delete(`${baseUrl}/group/${groupId}`)
  .then(
    res => res.data
  )
}

export const leaveGroupQuery = ({groupId, userId}) => {
  console.log("in leaveGroupQuery, groupId: ", groupId, "userId: ", userId)
  return axios.put(`${baseUrl}/group/${groupId}/${userId}`)
  .then(
    res => res.data
  )
}