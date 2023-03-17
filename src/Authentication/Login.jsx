import { Box, TextField, Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginQuery } from "../../Utils/Queries"
import { useMutation } from "react-query"

const Login = () => {
  const navigate = useNavigate()
  const loginMutation = useMutation(loginQuery, {
    onSuccess: (data) => {
      sessionStorage.setItem('token',JSON.stringify(data.token))
      const existingUser = {email:data.user.email,firstName:data.firstName,lastName:data.lastName}
      sessionStorage.setItem('user',JSON.stringify(existingUser))
      navigate('/UserHome')
    },
    onError: () => {
      setInvalid(true)
        setTimeout(() => {
          setInvalid(false);
        }, "4000");
    }
  })

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [invalid, setInvalid] = useState("")

  const handleLogin = async(email, password) => {
    loginMutation.mutate({password,email})
  }

  return (
    <div>
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        {loginMutation.isLoading && <p>Loading</p>}
        {invalid && <p>Wrong credentials!</p>}
        <TextField
          required
          id="outlined-required"
          label="Email"
          onChange={(event) => {setEmail(event.target.value)}}
        />

        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(event) => {setPassword(event.target.value)}}
        />
      </div>
      
      <Button variant="text" onClick={() => {handleLogin(email,password)}}>Login</Button>
    </Box>
    </div>
  )
}

export default Login