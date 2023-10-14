import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, FormControl, Autocomplete } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createNoteSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppDataContext } from '../../context/AppDataContext';


export const CreateNoteModal = ({notes,setNotes, projectId,subSectionId}) => {
  const { uniqueSources, setUniqueSources, allProjectNotes, setAllProjectNotes } = React.useContext(AppDataContext)
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
  const {createNoteMutation,invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createNoteSchema) 
  })
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addSource, setAddSource] = React.useState(false)
  const [userSourceInput, setUserSourceInput] = React.useState('')

  const handleAddSource = () => {
    setAddSource(!addSource)
  }

  const handleCreateNote= async(data) => {
    const {content} = data
    createNoteMutation.mutate({content, projectId:projectId||null, subSectionId:subSectionId||null, sources:userSourceInput?[{source:userSourceInput}]:[]}, {
      onSuccess: (data) => {
        if(data.sources.length != 0){setUniqueSources([...uniqueSources, ...data.sources]);}
        setNotes([...notes, data])
        setAllProjectNotes([...allProjectNotes, data])
        setOpen(false)
        setValue("content", "")
        setValue("source", "")
        setAddSource(false)
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
                <br />
                <FormControlLabel control={<Checkbox checked={addSource} {...register("addSource")} onChange={handleAddSource}/>} label="Add Source" />
                {addSource && 
                  <Autocomplete
                    freeSolo
                    id="source"
                    disableClearable
                    options={uniqueSources.map((source) => source.source)}
                    onInputChange={(event, newValue) => {
                      setUserSourceInput(newValue);
                    }}
                    inputValue={userSourceInput}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Source"
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                        }}
                        required
                        error={errors.source ? true : false}
                        helperText={errors.source?.message}
                        {...register("source")}
                      />
                    )}
                  />
                }
                <br />
                <Button variant="text" type="submit">Create Note</Button>
            </Box>
        </Modal>
    </div>
    );
}