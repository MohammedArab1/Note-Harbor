import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createNoteSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import { AppDataContext } from '../../context/AppDataContext';
import CreatableSelect from 'react-select/creatable';
import chroma from 'chroma-js';
import Select from 'react-select';
import {Modal, Box, TextInput, rem, Button, Group, Alert, Transition, Title, LoadingOverlay, Checkbox, Flex, Autocomplete, MultiSelect} from '@mantine/core';
import { GenericModal } from './GenericModal';
import { IconInfoCircle } from '@tabler/icons-react';
import { TagMultiSelect } from './TagMultiSelect';
import ErrorAlert from './ErrorAlert';

export const CreateNoteModal = ({projectId,subSectionId, opened, close}) => {
  const { allProjectNotes, setAllProjectNotes, tags, setTags } = React.useContext(AppDataContext)
  const {createNoteMutation,updateTagNoteMutation,invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createNoteSchema) 
  })
  const [uniqueSources, setUniqueSources] = React.useState([])
  const [selectedTags, setSelectedTags] = React.useState([])
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
    const {content} = data
    createNoteMutation.mutate({content, projectId:projectId||null, subSectionId:subSectionId||null, sources:userSourceInput?[{source:userSourceInput, additionalSourceInformation:userAdditionalSourceInformationInput}]:[]}, {
      onSuccess: (data) => {
        setAllProjectNotes([...allProjectNotes, data])
        if (selectedTags && selectedTags.length > 0){
          updateTagNoteMutation.mutate({note:data._id, tagIds:selectedTags},{
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
              setSelectedTags([])
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

  return (
    <div>
      <GenericModal opened={opened} close={close} title="Create a note">
        <form onSubmit={handleSubmit((data)=>{handleCreateNote(data)})}>
          {createNoteMutation.isFetching && <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
          {/* <Transition
          mounted={invalid.isInvalid}
          transition="fade"
          duration={400}
          timingFunction="ease">
              {(styles) => 
              <div style={styles}>
                  <Alert variant="light" color="red" title="Problem with creating project" icon={<IconInfoCircle />}>
                      {invalid.message}
                  </Alert>
              </div>}
            </Transition> */}
            <ErrorAlert invalid={invalid} title={"Problem with creating note"}/>
            <TextInput
              error={errors.content ? true : false}
              placeholder={errors.content?.message || 'Your note content'}
              withAsterisk
              id="content"
              label="Note content"
              {...register("content")}
              radius='md'
            />
            <Flex
              mih={20}
              mt={15}
              gap="md"
              justify="flex-start"
              align="flex-start"
              direction="row"
              wrap="wrap"
          >
          <Checkbox id='addSource' checked={addSource} {...register("addSource")} onChange={handleAddSource} label="Add source" />
          </Flex>
          <Transition
          mounted={addSource}
          transition="fade"
          duration={400}
          timingFunction="ease">
            {(styles) =>   
              <div style={styles}>
                <Autocomplete
                  label="Source"
                  id="source"
                  withAsterisk
                  data={uniqueSources.map((source) => source.source)}
                  value={userSourceInput || ''}
                  // onChange={setUserSourceInput}
                  onChange={(value) => {
                    setUserSourceInput(value);
                    setValue("source", value);
                  }}
                  comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                  error={errors?.source ? true : false}
                  placeholder={errors.source?.message || 'Your source here'} 
                  // {...register("source")}
                />
                <TextInput
                  placeholder={'Your additional source information here'}
                  id="additionalSourceInformation"
                  label="Additional Source Information"
                  // {...register("additionalSourceInformation")}
                  onChange={(event) => {
                    setUserAdditionalSourceInformationInput(event.currentTarget.value);
                    setValue("additionalSourceInformation", event.currentTarget.value);
                  }}
                />

                {/* <CreatableMultiSelect 
                selectData={uniqueSources.map((source) => source.source)}
                value={userSourceInput || []}
                setValue={setUserSourceInput}
                label={'Source'}
                error={errors?.source ? true : false}
                id='source'
                // {...register("source")}
                register={register}
                registerValue={'source'}
                /> */}
              </div>}
          </Transition>
          {/* } */}
          {/* <Flex
            m={15}
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          > */}
          <Box my={15}>
              <TagMultiSelect value={selectedTags} setValue={setSelectedTags} tagData={selectValues}/>
          </Box>
          {/* </Flex> */}
          <Button variant="text" type="submit">Create Note</Button>
        </form>
      </GenericModal>
        {/* <Button onClick={handleOpen}>Create a note</Button>
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
        </Modal> */}
    </div>
    );
}