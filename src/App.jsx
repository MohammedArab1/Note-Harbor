import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './Authentication/PrivateRoutes';
import PublicRoutes from './Authentication/PublicRoutes';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Main from './Home';
import UserHomePage from './userPages/UserHomePage';
import ProjectDetails from './userPages/ProjectDetails';
import { AuthContext } from '../context/AuthContext';
import NavigationBar from './Components/NavigationBar';
import { Navigate } from 'react-router-dom';

const App = () => {

  const [user, setUser] = useState(null)
  const [invalid, setInvalid] = useState({isInvalid:false,message:""})

  return (
    <AuthContext.Provider value={{user, setUser, invalid, setInvalid}}>
      <div>
        <NavigationBar/>
        <Routes>
          <Route index path='/' element={<Main />}/>
          <Route element={<PublicRoutes/>}>
            <Route path='/login' element={<Login />}/>
            <Route path='/Register' element={<Register />}/>
          </Route>

          <Route element={<PrivateRoutes/>}>
            <Route path='/UserHome' element={<UserHomePage />}/>
            <Route path='/ProjectDetails/:projectId' element={<ProjectDetails />}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  )
}

export default App
