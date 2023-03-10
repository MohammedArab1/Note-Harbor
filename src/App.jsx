import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Main from './Home';
import UserHomePage from './userPages/UserHomePage';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/Register' element={<Register />}/>
        <Route path='/UserHome' element={<UserHomePage />}/>
      </Routes>
    </div>
  )
}

export default App
