import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createSubSectionSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import { GenericModal } from './GenericModal';
import {TextInput, Button, Flex } from '@mantine/core';
import ErrorAlert from './ErrorAlert';

export const CreateSubSectionModal = ({subSections,setSubSections, projectId, opened,close}) => {

  const {createSubSectionMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createSubSectionSchema) 
  })

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
    <>
      <GenericModal opened={opened} close={close} title="Create a subsection">
        <form onSubmit={handleSubmit((data)=>{handleCreateSubSection(data)})}>
          {createSubSectionMutation.isLoading && <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
          <ErrorAlert invalid={invalid} title={"Problem with creating subsection"}/>
          <TextInput 
              error={errors.name ? true : false}
              placeholder={errors.name?.message || 'Your subsection name'}
              withAsterisk
              id="name"
              label="Subsection name"
              {...register("name")}
              radius='md'
          /> 
          <TextInput
              error={errors.description ? true : false}
              placeholder={errors.description?.message || 'Your subsection description'}
              id="description"
              label="Subsection description"
              {...register("description")}
              radius='md'
          />
          <Flex
            mt={15}
            gap="md"
            justify="center"
            direction="row"
            wrap="wrap"
          >
          <Button variant="text" type="submit">Create sub section</Button>  
          </Flex>
        </form>
      </GenericModal>
        {/* <Button onClick={handleOpen}>Create a sub section</Button>
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
        </Modal> */}
    </>
    );
}