import { Box, TextField, Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginQuery } from "../../Utils/Queries"
import { useMutation } from "react-query"
import { useForm } from "react-hook-form"
import { loginSchema } from "../../Utils/yupSchemas"
import { yupResolver } from "@hookform/resolvers/yup";


const Login = () => {
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver:yupResolver(loginSchema)
  })
  const navigate = useNavigate()
  const loginMutation = useMutation(loginQuery, {
    onSuccess: (data) => {
      const user = {token:data.token,email:data.user.email,firstName:data.user.firstName,lastName:data.user.lastName}
      sessionStorage.setItem('user',JSON.stringify(user))
      navigate('/UserHome')
    },
    onError: (error) => {
      setInvalid(true)
        setTimeout(() => {
          setInvalid(false);
        }, "4000");
    }
  })
  const [invalid, setInvalid] = useState("")
  const handleLogin = async(data) => {
    const {email, password} = data
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
      onSubmit={handleSubmit((data)=>{handleLogin(data)})}
    >
      <div>
        {loginMutation.isLoading && <p>Loading</p>}
        {invalid && <p>Wrong credentials!</p>}
        <TextField
          error={errors.email ? true : false}
          helperText={errors.email?.message}
          required
          id="email"
          label="Email"
          {...register("email")}
        />
        <TextField
          error={errors.password ? true : false}
          helperText={errors.password?.message}
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          {...register("password")}
        />
      </div>
      
      <Button variant="text" type="submit">Login</Button>
    </Box>
    </div>
  )
}

export default Login