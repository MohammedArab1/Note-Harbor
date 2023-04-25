import { useNavigate } from "react-router-dom"
import {useAuth} from "../../customHooks/useAuth"


const NavigationBar= () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const loggedInNavBar = () => {
    return (
      <div>
        <button onClick={(e) => {onGenericClick(e,'/UserHome')}}>UserHome</button>
        <button onClick={(e) => {onLogoutClick(e)}}>Logout</button>
      </div>
    )
  }

  const loggedOutNavBar = () => {
    return (
      <div>
        <button onClick={(e) => {onGenericClick(e,'/login')}}>login</button>
        <button onClick={(e) => {onGenericClick(e,'/register')}}>Register</button>
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
      {user ? loggedInNavBar() : loggedOutNavBar()}
    </div>
  )
}



export default NavigationBar