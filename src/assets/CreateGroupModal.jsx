import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createGroupSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';

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
  const {createGroupMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue} = useForm({
    resolver:yupResolver(createGroupSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateGroup= async(data) => {
    const {groupName, description} = data
    createGroupMutation.mutate({groupName,description}, {
      onSuccess: (data) => {
        setGroups([...groups, data])
        setOpen(false)
        setValue("groupName", "")
        setValue("description", "")
      }
    })
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
        {invalid.isInvalid && <p>{invalid.message}</p>}
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