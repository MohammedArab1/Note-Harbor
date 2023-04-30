export const returnSessionObject = () => {
  return JSON.parse(sessionStorage.getItem('user'))
}

export const isUserLeader = (userId) => {
  return returnSessionObject().id === userId;
}

export const setInvalidError = (setInvalid, error) => {
  setInvalid({isInvalid:true,message:error.response.data.error})
  setTimeout(() => {
    setInvalid({isInvalid:false,message:""})
  }, 4000);
}