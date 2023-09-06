import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createSubSectionSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';


export const CreateSubSectionModal = ({subSections,setSubSections, projectId}) => {

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
  const {createSubSectionMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createSubSectionSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateSubSection= async(data) => {
    var {name, description} = data
    createSubSectionMutation.mutate({name, description, projectId}, {
      onSuccess: (data) => {
        setSubSections([...subSections, data])
        setOpen(false)
        setValue("name", "")
        setValue("description", "")
      }
    })
  }
  return (
    <div>
        <Button onClick={handleOpen}>Create a sub section</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={style}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit((data)=>{handleCreateSubSection(data)})}
            >
                {invalid.isInvalid && <p>{invalid.message}</p>}
                <TextField
                error={errors.name ? true : false}
                helperText={errors.name?.message}
                required
                id="name"
                label="Sub Section Name"
                {...register("name")}
                />
                
                <TextField
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                id="description"
                label="Description"
                type="description"
                {...register("description")}
                />

                <Button variant="text" type="submit">Create sub section</Button>
            </Box>
        </Modal>
    </div>
    );
}