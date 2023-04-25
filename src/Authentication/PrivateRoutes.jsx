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

//todo next: it seems like the issue I had earlier is not fixed. if the token expires and the user tries to make another request, he is supposed to be led back to the login page. 
  //Make sure of that (axios response interceptor should be working)(seems to only happen when you try to access groupDetails with an expired token)

//todo next: allow user to create a meetup (Only group leader can create a meetup)

//todo: refresh the token automatically, currently tokens expire after 1 hour. (https://blog.logrocket.com/using-axios-set-request-headers/ search "Axios interceptors are also useful")


//todo (low priority): make sure that when user creates group, the returned saved group is a populated object
export default PrivateRoutes