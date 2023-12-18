import { useNavigate } from "react-router-dom"
import {useAuth} from "../../customHooks/useAuth"
import { isOfflineMode } from "../../Utils/Utils"

const NavigationBar= () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()
  const onOfflineButtonClick = (e) => {
    e.preventDefault()
    const offlineMode = localStorage.getItem("offlineMode");
    const isOfflineMode = offlineMode === "true";
    localStorage.setItem("offlineMode", !isOfflineMode);
    if (!isOfflineMode) {
      logout()
      navigate("/userHome");
    }
    else {
      navigate("/login");
    }
  }

  const loggedInNavBar = () => {
    return (
      <div>
        <button onClick={(e) => {onGenericClick(e,'/UserHome')}}>UserHome</button>
        {!isOfflineMode()&&<button onClick={(e) => {onLogoutClick(e)}}>Logout</button>}
        {isOfflineMode() && <button onClick={(e) => {onOfflineButtonClick(e)}}>No Longer Offline</button>}
      </div>
    )
  }

  const loggedOutNavBar = () => {
    return (
      <div>
        <button onClick={(e) => {onGenericClick(e,'/login')}}>login</button>
        <button onClick={(e) => {onGenericClick(e,'/register')}}>Register</button>
        <button onClick={(e) => {onOfflineButtonClick(e)}}>Offline</button>
      </div>
    )
  }

  const onLogoutClick = (e) => {
    e.preventDefault()
    logout()
    navigate('/login')
  }

  const onGenericClick = (e, path) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <div>
      { (user || isOfflineMode()) ? loggedInNavBar() : loggedOutNavBar()}
    </div>
  )
}



export default NavigationBar