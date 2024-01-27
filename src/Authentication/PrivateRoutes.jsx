import { Navigate, Outlet, useNavigate} from "react-router-dom"
import { useAuth } from "../../customHooks/useAuth"
import { isOfflineMode } from "../../Utils/Utils"
import { LoadingOverlay } from "@mantine/core"

const PrivateRoutes = () => {
  const {user, isLoading} = useAuth()
  // const isOfflineMode = localStorage.getItem("offlineMode") === "true";

  if(isLoading) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
  return (
    (user || isOfflineMode()) ? <Outlet/> : <Navigate to="/"/>
  )
}



export default PrivateRoutes