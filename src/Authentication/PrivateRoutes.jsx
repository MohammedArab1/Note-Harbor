import { Navigate, Outlet} from "react-router-dom"


const PrivateRoutes = () => {
  const token = sessionStorage.getItem('token')
  const user = sessionStorage.getItem('user')
  const loggedIn = token && user

  return (
    loggedIn ? <Outlet/> : <Navigate to="/login"/>
  )
  
}

export default PrivateRoutes