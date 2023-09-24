import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createTagSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CirclePicker, GithubPicker } from 'react-color';
import CircleIcon from '@mui/icons-material/Circle';


export const CreateTagModal = ({projectId, tags, setTags}) => {

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
  const {createTagMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createTagSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const [colour, setColour] = React.useState("#000000");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateTag= async(data) => {
    var {tagName} = data
    createTagMutation.mutate({tagName,colour, projectId }, {
      onSuccess: (data) => {
        setTags([...tags, data])
        setOpen(false)
        setValue("content", "")
      }
    })
  }
  return (
    <div>
        <Button onClick={handleOpen}>Create a tag</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={style}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit((data)=>{handleCreateTag(data)})}
            >
                {invalid.isInvalid && <p>{invalid.message}</p>}
                <TextField
                error={errors.tagName ? true : false}
                helperText={errors.tagName?.message}
                required
                id="tagName"
                label="Tag Name"
                {...register("tagName")}
                />
                <CircleIcon style={{ color: colour }} fontSize='large'/>
                <br />
                <br />
                <p>Please pick a color corresponding to this tag:</p>
                <CirclePicker id="tagColour" width='100%'
                    color={colour}
                    onChangeComplete={(color)=>{setColour(color.hex)}}
                />
                <Button variant="text" type="submit">Create Tag</Button>
            </Box>
        </Modal>
    </div>
    );
}