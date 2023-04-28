import { Navigate, Outlet, useNavigate} from "react-router-dom"
import { useAuth } from "../../customHooks/useAuth"


const PrivateRoutes = () => {
  const {user, isLoading} = useAuth()
  if(isLoading) return <p>Loading...</p>
  return (
    (user) ? <Outlet/> : <Navigate to="/login"/>
  )
}


//todo next: allow user to create a meetup (Only group leader can create a meetup)

//todo next: Group leader can change group details. Can leave from group. Can delete group. Can kick members from group.

//todo: refresh the token automatically, currently tokens expire after 1 hour. (https://blog.logrocket.com/using-axios-set-request-headers/ search "Axios interceptors are also useful")


//todo (low priority): make sure that when user creates group, the returned saved group is a populated object

//notes: figured out that you don't need the axios interceptor, the PrivateRoutes component is supposed to do the checking for you. The only problem was getting the 
  //PrivateRoutes component to rerender to check if user exists. This can be done by including the useAuth() hook in all protected components, which calls a useEffect()
  //hook, changing the user context, causing the privateRoutes to rerender.
export default PrivateRoutes