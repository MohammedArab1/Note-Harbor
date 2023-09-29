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
  const { sources, setSources } = React.useContext(AppDataContext)
  console.log("sources are: ", sources)
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
  const {createNoteMutation, createSourceMutation,invalid} = useMutations()
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
    console.log("data content is:",content, "data user source input is: ", userSourceInput)
    createNoteMutation.mutate({content, projectId:projectId||null, subSectionId:subSectionId||null}, {
      onSuccess: (data) => {
        if (userSourceInput != '') {
          createSourceMutation.mutate({source:userSourceInput, project:projectId, additionalSourceInformation:"toBeAddedInFrontend",note:data._id }, {
            onSuccess: (data) => {
              if (!sources.includes(data.source)) {
                  setSources([...sources, data.source]);
              }        
            }
          })
        }
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
                <br />
                <FormControlLabel control={<Checkbox checked={addSource} onChange={handleAddSource}/>} label="Add Source" />
                {addSource && 
                  //   <TextField
                  //   select
                  //   fullWidth
                  //   label="Select Source"
                  //   defaultValue={sources[0]}
                    // inputProps={register('select_source', {
                    //   required: 'Please enter source',
                    // })}
                  //   error={errors.select_source}
                  //   helperText={errors.select_source?.message}
                  // >
                  //   {sources.map((source,i) => (
                  //     <MenuItem key={i} value={source}>
                  //       {source}
                  //     </MenuItem>
                  //   ))}
                  // </TextField>



                  <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={sources}
                    onInputChange={(event, newValue) => {
                      setUserSourceInput(newValue);
                    }}
                    inputValue={userSourceInput}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search input"
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                        }}
                        // inputProps={register('select_source', {
                        //   required: 'Please enter source',
                        // })}
                      />
                    )}
                  />

                  // <ControlledAutocomplete
                  //     control={control}
                  //     name="Source"
                  //     options={sources}
                  //     onChange={(data) => console.log(data)}
                  //     getOptionLabel={(option) => `${option}`}
                  //     renderInput={(params) => <TextField {...params} label="My label" margin="normal" />}
                  //     defaultValue={null}
                  // />

                }
                <br />
                <Button variant="text" type="submit">Create Note</Button>
            </Box>
        </Modal>
    </div>
    );
}