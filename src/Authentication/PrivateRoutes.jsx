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
      console.log("token expired")
      isExpired = true;
    }
  }
  return (
    (user && !isExpired) ? <Outlet/> : <Navigate to="/login"/>
  )
}

//todo next: add "meetup" collection in db and maybe modify the group collection to include a description and a list of meetups

//todo: refresh the token automatically, currently tokens expire after 1 hour. (https://blog.logrocket.com/using-axios-set-request-headers/ search "Axios interceptors are also useful")
//todo: remove the 'validate' endpoint

export default PrivateRoutes