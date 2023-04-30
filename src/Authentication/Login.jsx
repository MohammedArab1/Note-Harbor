import { Box, TextField, Button } from "@mui/material"
import { useForm } from "react-hook-form"
import { useMutations } from "../../customHooks/useMutations"

const Login = () => {
  const {register, handleSubmit, formState:{errors}} = useForm()
  const {loginMutation, invalid} = useMutations()

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
        {invalid.isInvalid && <p>{invalid.message}</p>}
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