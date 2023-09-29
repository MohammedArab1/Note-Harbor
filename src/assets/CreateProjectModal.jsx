import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createProjectSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';




export const CreateProjectModal = ({projects,setProjects}) => {

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
  const {createProjectMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue} = useForm({
    resolver:yupResolver(createProjectSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateProject= async(data) => {
    const {projectName, description, isPrivate} = data
    createProjectMutation.mutate({projectName,description,isPrivate}, {
      onSuccess: (data) => {
        setProjects([...projects, data])
        setOpen(false)
        setValue("projectName", "")
        setValue("description", "")
      }
    })
  }
  return (
    <div>
      <Button onClick={handleOpen}>Create a project</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit((data)=>{handleCreateProject(data)})}
        >
        {invalid.isInvalid && <p>{invalid.message}</p>}
        <TextField
          error={errors.projectName ? true : false}
          helperText={errors.projectName?.message}
          required
          id="projectName"
          label="Project Name"
          {...register("projectName")}
        />
        <TextField
          error={errors.description ? true : false}
          helperText={errors.description?.message}
          id="description"
          label="Description"
          type="description"
          {...register("description")}
        />
        <br />
        <FormControlLabel 
          id='isPrivate' 
          type="isPrivate" 
          required 
          control={<Checkbox defaultChecked />} 
          label="Private" 
          {...register("isPrivate")}
        />
        <Button variant="text" type="submit">Create project</Button>
        </Box>
      </Modal>
    </div>
  );
}