export const returnSessionObject = () => {
  return JSON.parse(sessionStorage.getItem('user'))
}