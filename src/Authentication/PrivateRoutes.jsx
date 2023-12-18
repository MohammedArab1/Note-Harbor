import { Navigate, Outlet, useNavigate} from "react-router-dom"
import { useAuth } from "../../customHooks/useAuth"
import { isOfflineMode } from "../../Utils/Utils"

const PrivateRoutes = () => {
  const {user, isLoading} = useAuth()
  // const isOfflineMode = localStorage.getItem("offlineMode") === "true";

  if(isLoading) return <p>Loading...</p>
  return (
    (user || isOfflineMode()) ? <Outlet/> : <Navigate to="/login"/>
  )
}



export default PrivateRoutes