import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createGroupSchema } from '../../Utils/yupSchemas';
import { useMutation } from 'react-query';
import { createGroupQuery } from '../../Utils/Queries';

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

export const CreateGroupModal = ({groups,setGroups}) => {
  const {register, handleSubmit, formState:{errors}, setValue} = useForm({
    resolver:yupResolver(createGroupSchema) 
  })
  const CreateGroupMutation = useMutation(createGroupQuery, {
    onSuccess: (data) => {
      setGroups([...groups, data.newGroup])
      setOpen(false)
      setValue("groupName", "")
      setValue("description", "")
    },
    onError: (error) => {
      setInvalid(true)
        setTimeout(() => {
          setInvalid(false);
        }, "4000");
    }
  })
  const [open, setOpen] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateGroup= async(data) => {
    const {groupName, description} = data
    CreateGroupMutation.mutate({groupName,description})
  }
  return (
    <div>
      <Button onClick={handleOpen}>Create a group</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit((data)=>{handleCreateGroup(data)})}
        >
        {invalid && <p>error creating group. Please try again later.</p>}
        <TextField
          error={errors.groupName ? true : false}
          helperText={errors.groupName?.message}
          required
          id="groupName"
          label="Group Name"
          {...register("groupName")}
        />
        <TextField
          error={errors.description ? true : false}
          helperText={errors.description?.message}
          id="description"
          label="Description"
          type="description"
          {...register("description")}
        />
        <Button variant="text" type="submit">Create group</Button>
        </Box>
      </Modal>
    </div>
  );
}