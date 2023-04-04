import { Box, TextField, Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerQuery } from "../../Utils/Queries"
import { useMutation } from "react-query"
import { useForm } from "react-hook-form"
import { registerSchema } from "../../Utils/yupSchemas"
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios"

const Register = () => {
  const [invalid, setInvalid] = useState({isInvalid:false, message:""})
  const navigate = useNavigate()
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver:yupResolver(registerSchema)
  })
  const registerMutation = useMutation(registerQuery, {
    onSuccess: (data) => {
      const user = {token:data.token,id:data.newUser._id,email:data.newUser.email,firstName:data.newUser.firstName,lastName:data.newUser.lastName}
      sessionStorage.setItem('user',JSON.stringify(user))
      navigate('/UserHome')
    },
    onError:(error) => {
      setInvalid({isInvalid:true, message:error.response.data.error})
        setTimeout(() => {
          setInvalid(false);
        }, "4000");
    }
  })

  const handleRegister = async (data) => {
    const {firstName,lastName,email,password} = data
    registerMutation.mutate({firstName,lastName,email,password})
  }

  return (
    <div>
    {registerMutation.isLoading && <p>Loading</p>}
    {invalid.isInvalid && <p>{invalid.message}</p>}
    <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
    onSubmit={handleSubmit((data)=>{handleRegister(data)})}
  >
    <div>
    <TextField
        error={errors.firstName ? true : false}
        helperText={errors.firstName?.message}
        required
        id="firstName"
        label="First name"
        {...register("firstName")}
      />
      <TextField
        error={errors.lastName ? true : false}
        helperText={errors.lastName?.message}
        required
        id="lastName"
        label="Last name"
        {...register("lastName")}
      />
      <TextField
        error={errors.email ? true : false}
        helperText={errors.email?.message}
        required
        id="email"
        label="Email"
        {...register("email",{required:"Please provide an email address", pattern:
        {value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message:"Please provide a valid email address"}
        })}
      />
      <TextField
        error={errors.password ? true : false}
        helperText={errors.password?.message}
        id="password"
        required
        label="Password"
        type="password"
        autoComplete="current-password"
        {...register("password")}
      />
      <TextField
        error={errors.cpassword ? true : false}
        helperText={errors.cpassword?.message}
        id="cpassword"
        required
        label="Confirm Password"
        type="password"
        autoComplete="current-password"
        {...register("cpassword")}
      />
    </div>
    
    <Button variant="text" type="submit">Register</Button>
  </Box>
  </div>
  )
}

export default Register