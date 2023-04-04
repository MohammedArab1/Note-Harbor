import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './Authentication/PrivateRoutes';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Main from './Home';
import UserHomePage from './userPages/UserHomePage';
import GroupDetails from './userPages/GroupDetails';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/Register' element={<Register />}/>
        <Route element={<PrivateRoutes/>}>
          <Route path='/UserHome' element={<UserHomePage />}/>
          <Route path='/GroupDetails' element={<GroupDetails />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
