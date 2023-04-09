export const returnSessionObject = () => {
  return JSON.parse(sessionStorage.getItem('user'))
}

export const isUserLeader = (userId) => {
  return returnSessionObject().id === userId;
}