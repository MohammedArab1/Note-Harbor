import { Navigate, Outlet} from "react-router-dom"
import { returnSessionObject } from "../../Utils/Utils"
import jwt_decode from "jwt-decode"


const PrivateRoutes = () => {
  
  const user = sessionStorage.getItem('user')
  var isExpired = false;
  if (user) {
    const decodedToken = jwt_decode(returnSessionObject().token);
    const dateNow = new Date();
    if (decodedToken.exp*1000 < dateNow.getTime()) {
      isExpired = true;
    }
  }
  return (
    (user && !isExpired) ? <Outlet/> : <Navigate to="/login"/>
  )
}

//todo next: allow user to create a meetup (Only group leader can create a meetup)

//todo: refresh the token automatically, currently tokens expire after 1 hour. (https://blog.logrocket.com/using-axios-set-request-headers/ search "Axios interceptors are also useful")

export default PrivateRoutes