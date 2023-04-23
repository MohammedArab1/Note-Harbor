import { Navigate, Outlet, useNavigate} from "react-router-dom"
import { useAuth } from "../../customHooks/useAuth"


const PrivateRoutes = () => {
  const {user, isLoading} = useAuth()

  if(isLoading) return <p>Loading...</p>
  return (
    (user) ? <Outlet/> : <Navigate to="/login"/>
  )
}


//todo next: make sure all errors retrieve correct error messages
//todo next: make it so that user can't reach login page or register page if logged in already


//todo usersHomePage line 18, don't know if I want state, I can just put a parameter there (:id as route)

//todo next: allow user to create a meetup (Only group leader can create a meetup)

//todo: refresh the token automatically, currently tokens expire after 1 hour. (https://blog.logrocket.com/using-axios-set-request-headers/ search "Axios interceptors are also useful")


//todo (low priority): make sure that when user creates group, the returned saved group is a populated object
export default PrivateRoutes