import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField, FormControlLabel, Checkbox, Autocomplete } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createNoteSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppDataContext } from '../../context/AppDataContext';
import CreatableSelect from 'react-select/creatable';
import chroma from 'chroma-js';
import Select from 'react-select';

export const CreateNoteModal = ({projectId,subSectionId}) => {
  const { allProjectNotes, setAllProjectNotes, tags, setTags } = React.useContext(AppDataContext)
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
  const {createNoteMutation,updateTagNoteMutation,invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createNoteSchema) 
  })
  const [open, setOpen] = React.useState(false);
  const [uniqueSources, setUniqueSources] = React.useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addSource, setAddSource] = React.useState(false)
  const [userSourceInput, setUserSourceInput] = React.useState('')
  const [userAdditionalSourceInformationInput, setUserAdditionalSourceInformationInput] = React.useState('')
  const [selectValues, setSelectValues] = React.useState([])
  const handleAddSource = () => {
    setAddSource(!addSource)
  }

  React.useEffect(() => {
    const allSources = allProjectNotes.reduce((accumulator, note) => {
      return accumulator.concat(note.sources);
    }, []);
    const calculatedUniqueSources = allSources.filter((source, index, self) =>  
      index === self.findIndex((t) => (
            t.source === source.source
        ))
    );
    setUniqueSources(calculatedUniqueSources)
  }, [allProjectNotes])
  

  React.useEffect(() => {
    setSelectValues(tags.map((tag) => {
      return {
        value: tag._id,
        label: tag.tagName,
        color: tag.colour,
      }
    }))
  }, [tags])
  
  const handleCreateNote= async(data) => {
    const {content, tagSelect} = data
    createNoteMutation.mutate({content, projectId:projectId||null, subSectionId:subSectionId||null, sources:userSourceInput?[{source:userSourceInput, additionalSourceInformation:userAdditionalSourceInformationInput}]:[]}, {
      onSuccess: (data) => {
        setAllProjectNotes([...allProjectNotes, data])
        if (tagSelect && tagSelect.length > 0){
          updateTagNoteMutation.mutate({note:data._id, tagIds:tagSelect},{
            onSuccess:(data) => {
              const newTags = tags.map(tag => {
                // Find the corresponding tag in the data array
                const dataTag = data.find(d => d._id === tag._id);
                // If the tag is in the data array, update its notes field
                if (dataTag) {
                    return { ...tag, notes: dataTag.notes };
                }
                // If the tag is not in the data array, return it as is
                return tag;
              });
              setTags(newTags);
              setOpen(false)
              setValue("content", "")
              setValue("source", "")
              setValue("additionalSourceInformation", "")
              setValue("tagSelect", "")
              setAddSource(false)
            }
          })
        }
        else {
          setOpen(false)
          setValue("content", "")
          setValue("source", "")
          setValue("additionalSourceInformation", "")
          setAddSource(false)
        }
      }
    })
  }


  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });
  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
        ...dot(data.color),
      };
    },
    placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    multiValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };


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
                <>
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
                  <br />
                  <TextField
                    id="additionalSourceInformation"
                    label="Additional Source Information"
                    {...register("additionalSourceInformation")}
                    value={userAdditionalSourceInformationInput}
                    onChange={(e) => setUserAdditionalSourceInformationInput(e.target.value)}
                  />
                </>
                }
                <br />
                <Controller
                  name="tagSelect"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={selectValues}
                      styles={colourStyles}
                      value={selectValues.find((c) => c.value === value)}
                      onChange={(val) => onChange(val.map((v) => v.value))}
                    />
                  )}
                />
                <br />
                <Button variant="text" type="submit">Create Note</Button>
            </Box>
        </Modal>
    </div>
    );
}