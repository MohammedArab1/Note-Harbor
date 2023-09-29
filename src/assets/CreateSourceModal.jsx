import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createSourceSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';


export const CreateSourceModal = ({projectId, sources, setSources}) => {

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
  const {createSourceMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createSourceSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateSource= async(data) => {
    var {source,additionalSourceInformation} = data
    createSourceMutation.mutate({source, project:projectId, additionalSourceInformation }, {
      onSuccess: (data) => {
        if (!sources.includes(data.source)) {
            setSources([...sources, data.source]);
        }        
        setOpen(false)
        setValue("source", "")
        setValue("additionalSourceInformation", "")
      }
    })
  }
  return (
    <div>
        <Button onClick={handleOpen}>Create a source (NOT WORKING ANYMORE BECAUSE SOURCE NOW NEEDS TO BE ASSOCIATED WITH NOTE.)</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={style}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit((data)=>{handleCreateSource(data)})}
            >
                {invalid.isInvalid && <p>{invalid.message}</p>}
                <TextField
                    error={errors.source ? true : false}
                    helperText={errors.source?.message}
                    required
                    id="source"
                    label="Original Source"
                    {...register("source")}
                />
                <TextField
                    error={errors.additionalSourceInformation ? true : false}
                    helperText={errors.additionalSourceInformation?.message}
                    id="additionalSourceInformation"
                    label="Additional Source Information"
                    {...register("additionalSourceInformation")}
                />
                
                <Button variant="text" type="submit">Create source</Button>
            </Box>
        </Modal>
    </div>
    );
}