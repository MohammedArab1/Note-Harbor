import { Box, TextField, Button } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
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
        <TextField
          required
          id="outlined-required"
          label="Email"
          defaultValue="Hello World"
        />

        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
      </div>
      
      <Button variant="text" component={Link} to="/UserHome">Login</Button>
    </Box>
      
    </div>
  )
}

export default Login