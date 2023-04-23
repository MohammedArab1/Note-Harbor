import { useNavigate } from "react-router-dom"
import {useAuth} from "../../customHooks/useAuth"


const NavigationBar= () => {
  const {user, logout} = useAuth()
  const navigate = useNavigate()

  const loggedInNavBar = () => {
    return (
      <div>
        <button onClick={(e) => {onLogoutClick(e)}}>Logout</button>
      </div>
    )
  }

  const loggedOutNavBar = () => {
    return (
      <div>
        <button onClick={(e) => {onLoginClick(e)}}>login</button>
        <button onClick={(e) => {onRegisterClick(e)}}>Register</button>
      </div>
    )
  }

  const onLogoutClick = (e) => {
    e.preventDefault()
    logout()
    navigate('/login')
  }

  const onLoginClick = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  const onRegisterClick = (e) => {
    e.preventDefault()
    navigate('/register')
  }

  return (
    <div>
      {user ? loggedInNavBar() : loggedOutNavBar()}
    </div>
  )
}



export default NavigationBar