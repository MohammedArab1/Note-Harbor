import { Navigate, Outlet} from "react-router-dom"
import { returnSessionObject } from "../../Utils/Utils"
import { useQuery } from "react-query"
import { validateTokenExpiryDate } from "../../Utils/Queries"


const PrivateRoutes = () => {

  const {isLoading,data} = useQuery('validateTokenExpiry',async () => {
    const user = sessionStorage.getItem('user')
    if (!user) {
      return false
    }
    const expiredEndpoint = await validateTokenExpiryDate((returnSessionObject().token))
    if (expiredEndpoint.expired === true) {
      sessionStorage.removeItem('user')
      return false
    }
    return true
  })

  if (isLoading) {
    return <div>loading...</div>
  }
  

  return (
    (data) ? <Outlet/> : <Navigate to="/login"/>
  )
}

//TO FIX NEXT TIME: 1. MAKE THE VALIDATE ENDPOINT SECURE
//2. LOOK AT QUERIES.JS FILE, FIGURE OUT HOW TO AUTOSET HEADERS
//3. IN THE BACKEND, GROUPCONTROLLER.JS LINE 24, ENSURE THAT THE .POPULATE IS WORKING, OTHERWISE REMOVE
//4. in userHomePage.jsx, line 7, uncomment and make it work

export default PrivateRoutes