import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from 'react-query';
import { JoinGroupSchema } from '../../Utils/yupSchemas';
import { joinGroupQuery } from '../../Utils/Queries';

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

export const JoinGroupModal = ({groups,setGroups}) => {
  const {register, handleSubmit, formState:{errors},setValue} = useForm({
    resolver:yupResolver(JoinGroupSchema) 
  })
  const JoinGroupMutation = useMutation(joinGroupQuery, {
    onSuccess: (data) => {
      const filteredGroups = groups.filter(group => group.accessCode === data.group.accessCode)
      if (!filteredGroups.length > 0) {
        setGroups([...groups, data.group])
      }
      setOpen(false)
      setValue("accessCode", "")
    },
    onError: (error) => {
      setInvalid({isInvalid:true, message:error.response.data.error})
        setTimeout(() => {
          setInvalid(false);
        }, "4000");
    }
  })
  const handleJoinGroup= async(data) => {
    const {accessCode} = data
    // const sessionUserId = returnSessionObject().id
    JoinGroupMutation.mutate({accessCode})
  }

  const [open, setOpen] = React.useState(false);
  const [invalid, setInvalid] = React.useState({isInvalid:false, message:""});
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
        onSubmit={handleSubmit((data)=>{handleJoinGroup(data)})}
        >
        {invalid.isInvalid && <p>{invalid.message}</p>}
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