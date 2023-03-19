import axios from 'axios'

const baseUrl = 'http://localhost:3001/api'

export const loginQuery = userObject =>
  axios.post(`${baseUrl}/login`, userObject)
  .then(
    res => res.data
  )

export const registerQuery = userObject => {
  return axios.post(`${baseUrl}/user/register`, userObject).then(
    res => res.data
  )
}