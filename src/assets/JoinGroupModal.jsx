import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { JoinGroupSchema } from '../../Utils/yupSchemas';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const JoinGroupModal = () => {
  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver:yupResolver(JoinGroupSchema) 
  })
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Join a group</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit((data)=>{handleLogin(data)})}
        >

        <TextField
          error={errors.accessCode ? true : false}
          helperText={errors.accessCode?.message}
          required
          id="accessCode"
          label="Access Code"
          {...register("accessCode")}
        />

        <Button variant="text" type="submit">Join group</Button>
        </Box>
      </Modal>
    </div>
  );
}