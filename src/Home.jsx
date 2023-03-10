import { Link } from "react-router-dom"

const Main = () => {
  return (
    <div>
      Main page
      <br/>
      Login Header (these links will be in the header)
      <Link to="/Login"> Go to login page</Link>
      <Link to="/Register"> Go to Register page</Link>
    </div>
  )
}

export default Main