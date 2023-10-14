import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './Authentication/PrivateRoutes';
import PublicRoutes from './Authentication/PublicRoutes';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Main from './Home';
import UserHomePage from './userPages/UserHomePage';
import ProjectDetails from './userPages/ProjectDetails';
import SubSectionDetails from './userPages/SubSectionDetails';
import { AuthContext } from '../context/AuthContext';
import { AppDataContext } from '../context/AppDataContext';
import NavigationBar from './Components/NavigationBar';
import { Navigate } from 'react-router-dom';

const App = () => {

  const [user, setUser] = useState(null)
  const [invalid, setInvalid] = useState({isInvalid:false,message:""})
  const [tags, setTags] = useState([])
  const [uniqueSources, setUniqueSources] = useState([])
  const [notes, setNotes] = useState([])
  const [allProjectNotes, setAllProjectNotes] = useState([])
  const [subSections, setSubSections] = useState([])


  return (
    <AuthContext.Provider value={{user, setUser, invalid, setInvalid}}>
      <AppDataContext.Provider value={{tags, setTags, uniqueSources, setUniqueSources, notes, setNotes, allProjectNotes, setAllProjectNotes, subSections, setSubSections}}>
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
            <Route path='/ProjectDetails/:projectId/SubSectionDetails' element={<SubSectionDetails />}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      </AppDataContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
