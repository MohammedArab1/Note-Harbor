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

export const fetchProjectPerUserId = () => {
  return axios.get(`${baseUrl}/project`)
  .then(
    res => res.data
  )
}
export const fetchProjectById = (projectId) => {
  return axios.get(`${baseUrl}/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const createProjectQuery = (projectObject) => {
  return axios.post(`${baseUrl}/project`, projectObject)
  .then(
    res => res.data
  )
}

export const joinProjectQuery = (projectObject) => {
  return axios.put(`${baseUrl}/project`, projectObject)
  .then(
    res => res.data
  )
}


export const deleteProjectQuery = (projectId) => {
  return axios.delete(`${baseUrl}/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const leaveProjectQuery = ({projectId,newProject}) => {
  return axios.put(`${baseUrl}/project/${projectId}`, newProject)
  .then(
    res => res.data
  )
}

export const createSubSectionQuery = (subSectionObject) => {
  return axios.post(`${baseUrl}/subsection`, subSectionObject)
  .then(
    res => res.data
  )
}

export const createNoteQuery = (noteObject) => {
  return axios.post(`${baseUrl}/note`, noteObject)
  .then((res) => {
    return res.data
  })
}

export const createTagQuery = (tagObject) => {
  return axios.post(`${baseUrl}/tag`, tagObject)
  .then((res) => {
    return res.data
  })
}

export const updateTagNoteQuery = ({tagIds,note}) => {
  const promises = tagIds.map(tagId => 
    axios.patch(`${baseUrl}/tag/${tagId}`, {note})
        .then(res => res.data)
  );
  return Promise.all(promises);
}

export const createCommentQuery = (commentObject) => {
  return axios.post(`${baseUrl}/comment`, commentObject)
  .then((res) => {
    return res.data
  })
}

export const deleteNoteQuery = (noteIds) => {
  return axios.post(`${baseUrl}/note/deleteMany`, {noteIds:noteIds})
  .then((res) => {
    return res.data
  })
}

export const deleteSubSectionQuery = (subSectionId) => {
  return axios.delete(`${baseUrl}/subsection/${subSectionId}`)
  .then(
    res => res.data
  )
}

export const deleteTagQuery = (tagId) => {
  return axios.delete(`${baseUrl}/tag/${tagId}`)
  .then(
    res => res.data
  )
}

export const fetchSubSectionsPerProjectId = (projectId) => {
  return axios.get(`${baseUrl}/subsection/${projectId}`)
  .then(
    res => res.data
  )
}

export const fetchNotesPerProjectId = (projectId) => {
  return axios.get(`${baseUrl}/note/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const fetchTagsPerProjectId = (projectId) => {
  return axios.get(`${baseUrl}/tag/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const fetchAllNotesForProject = (projectId,subsectionIds) => {
  return axios.post(`${baseUrl}/note/allNotes`,{projectId,subsectionIds})
  .then(
    res => res.data
  )
}

export const fetchCommentsPerNoteId = (noteId) => {
  return axios.get(`${baseUrl}/comment/note/${noteId}`)
  .then(
    res => res.data
  )
}