import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createNoteSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';


export const CreateNoteModal = ({notes,setNotes, projectId}) => {

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
  const {createNoteMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createNoteSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateNote= async(data) => {
    var {content} = data
    createNoteMutation.mutate({content, projectId}, {
      onSuccess: (data) => {
        setNotes([...notes, data])
        setOpen(false)
        setValue("content", "")
      }
    })
  }
  return (
    <div>
        <Button onClick={handleOpen}>Create a note</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={style}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit((data)=>{handleCreateNote(data)})}
            >
                {invalid.isInvalid && <p>{invalid.message}</p>}
                <TextField
                error={errors.content ? true : false}
                helperText={errors.content?.message}
                required
                id="content"
                label="Note content"
                {...register("content")}
                />

                <Button variant="text" type="submit">Create Note</Button>
            </Box>
        </Modal>
    </div>
    );
}