import { Navigate, Outlet, useNavigate} from "react-router-dom"
import { useAuth } from "../../customHooks/useAuth"


const PrivateRoutes = () => {
  const {user, isLoading} = useAuth()
  if(isLoading) return <p>Loading...</p>
  return (
    (user) ? <Outlet/> : <Navigate to="/login"/>
  )
}



export default PrivateRoutes