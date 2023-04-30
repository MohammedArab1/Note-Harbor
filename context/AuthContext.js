import {createContext} from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: (user) => {},
  invalid: {
    isInvalid:false,message:""
    },
  setInvalid: (invalid) => {}
})