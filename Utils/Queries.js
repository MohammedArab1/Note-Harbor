import axios from 'axios'
import { returnSessionObject } from './Utils'


const baseUrl = import.meta.env.VITE_REACT_APP_API_URL


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


//done, nothing to change
export const loginQuery = userObject =>{
  return axios.post(`${baseUrl}/login`, userObject)
  .then(
    res => res.data
  )
}

//done, nothing to change
export const registerQuery = userObject => {
  return axios.post(`${baseUrl}/user/register`, userObject)
  .then(
    res => res.data
  )
}

//Done, lots of changes in the UserHomePage.jsx
export const fetchProjectPerUserId = () => {
  return axios.get(`${baseUrl}/project`)
  .then(
    res => res.data
  )
}
//Done (hopefully), lots of changes in the ProjectDetails.jsx
export const fetchProjectById = (projectId) => {
  return axios.get(`${baseUrl}/project/${projectId}`)
  .then(
    res => res.data
  )
}

//Done (hopefully), lots of changes in the CreateProjectModal.jsx
export const createProjectQuery = (projectObject) => {
  return axios.post(`${baseUrl}/project`, projectObject)
  .then(
    res => res.data
  )
}

//Done (hopefully), lots of changes in the JoinProjectModal.jsx
export const joinProjectQuery = (projectObject) => {
  return axios.put(`${baseUrl}/project`, projectObject)
  .then(
    res => res.data
  )
}


//Done (hopefully), lots of changes in the ProjectDetails.jsx
export const deleteProjectQuery = (projectId) => {
  return axios.delete(`${baseUrl}/project/${projectId}`)
  .then(
    res => res.data
  )
}

//Done (hopefully), lots of changes in the ProjectDetails.jsx
export const leaveProjectQuery = ({projectId,newProject}) => {
  return axios.put(`${baseUrl}/project/${projectId}`, newProject)
  .then(
    res => res.data
  )
}

//Done (hopefully), lots of changes in the CreateSubSectionModal.jsx 
export const createSubSectionQuery = (subSectionObject) => {
  return axios.post(`${baseUrl}/subsection`, subSectionObject)
  .then(
    res => res.data
  )
}

//Done (hopefully), lots of changes in the ProjectDetails.jsx
export const fetchSubSectionsPerProjectId = (projectId) => {
  return axios.get(`${baseUrl}/subsection/${projectId}`)
  .then(
    res => res.data
  )
}