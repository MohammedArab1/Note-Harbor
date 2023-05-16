import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { JoinGroupSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';


export const JoinGroupModal = ({groups,setGroups}) => {

  const isScreenSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isScreenSmall ? '80%' : 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const {register, handleSubmit, formState:{errors},setValue} = useForm({
    resolver:yupResolver(JoinGroupSchema) 
  })
  const {joinGroupMutation, invalid} = useMutations()

  const handleJoinGroup= async(data) => {
    const {accessCode} = data
    joinGroupMutation.mutate({accessCode}, {
      onSuccess: (data) => {
        const filteredGroups = groups.filter(group => {
          return group.accessCode === data.accessCode
        })
        if (!filteredGroups.length > 0) {
          setGroups([...groups, data])
        }
        setOpen(false)
        setValue("accessCode", "")
      }
    })
  }

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