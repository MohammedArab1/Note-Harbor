import * as React from 'react';
import chroma from "chroma-js"
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createTagSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import { CirclePicker, GithubPicker } from 'react-color';
import { GenericModal } from './GenericModal';
import { 
  Grid,
  Text,
  Flex,
  TextInput,
  Button,
  LoadingOverlay,
  ActionIcon
} from '@mantine/core';
import { IconCircleFilled, IconRefresh } from '@tabler/icons-react';

const generate5RandomColours = () => {
  var randomColorList = []
  for (let i = 0; i < 5; i++) {
    randomColorList.push(chroma.random().hex())
  }
  return randomColorList
}
export const CreateTagModal = ({projectId, tags, setTags, opened, close}) => {
  const [fiveColours1, setFiveColours1] = React.useState(generate5RandomColours())
  const [fiveColours2, setFiveColours2] = React.useState(generate5RandomColours())
  const [fiveColours3, setFiveColours3] = React.useState(generate5RandomColours())
  const {createTagMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createTagSchema) 
  })
  const [colour, setColour] = React.useState("#000000");
  const handleCreateTag= async(data) => {
    var {tagName} = data
    createTagMutation.mutate({tagName,colour, projectId }, {
      onSuccess: (data) => {
        setTags([...tags, data])
        close()
        setValue("tagName", "")
      }
    })
  }
  const refreshColors = () => {
    setFiveColours1(generate5RandomColours())
    setFiveColours2(generate5RandomColours())
    setFiveColours3(generate5RandomColours())
  }
  return (
    <>
    <GenericModal opened={opened} close={close} title="Create Tag">
      <Grid>
          <Grid.Col span={1} />
          <Grid.Col span={10}>
          <form onSubmit={handleSubmit((data)=>{handleCreateTag(data)})}>
          {createTagMutation.isLoading && <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}
            <Grid>
              <Grid.Col span={10} ml={5}>
                <TextInput
                  error={errors.tagName ? true : false}
                  placeholder={errors.tagName?.message || 'Your tag name'}
                  withAsterisk
                  id="tagName"
                  label="Tag Name"
                  {...register("tagName")}
                  radius='md'
                />
              </Grid.Col>
              <Grid.Col span={1}><span style={{color:colour}}><IconCircleFilled /></span></Grid.Col>
              <Grid.Col span={2}></Grid.Col>
              <Grid.Col span={8} ml={5}>
                <Flex

                gap="md"
                direction="row"
                wrap="wrap"
                justify="center">
                  <CirclePicker id="tagColour1"
                            color={colour}
                            onChangeComplete={(color)=>{setColour(color.hex)}}
                            colors={fiveColours1}
                        />
                  <CirclePicker id="tagColour2"
                            color={colour}
                            onChangeComplete={(color)=>{setColour(color.hex)}}
                            colors={fiveColours2}
                        />
                  <CirclePicker id="tagColour3"
                            color={colour}
                            onChangeComplete={(color)=>{setColour(color.hex)}}
                            colors={fiveColours3}
                        />
                </Flex>
              </Grid.Col>
              <Grid.Col span={1}>
                <ActionIcon variant='transparent' aria-label="refresh tag colors" mt={'sm'} onClick={(e)=>{refreshColors()}}>
                    <IconRefresh style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Grid.Col>
            </Grid>
            {/* <Flex
              // mih={20}
              // mt={15}
              gap="md"
              direction="row"
              wrap="wrap"
              justify="center"
              align="center"
            >
              <TextInput
                error={errors.tagName ? true : false}
                placeholder={errors.tagName?.message || 'Your tag name'}
                withAsterisk
                id="tagName"
                label="Tag Name"
                {...register("tagName")}
                radius='md'
              />
              <span style={{color:colour}}><IconCircleFilled /></span>
            </Flex> */}
            {/* <Flex
              // mih={20}
              mt={15}
              gap="md"
              direction="row"
              wrap="wrap"
              justify="center"
              align="center"
            >
              <CirclePicker id="tagColour1"
                        color={colour}
                        onChangeComplete={(color)=>{setColour(color.hex)}}
                        colors={fiveColours1.current}
                    />
                    <IconRefresh />
              <CirclePicker id="tagColour2"
                        color={colour}
                        onChangeComplete={(color)=>{setColour(color.hex)}}
                        colors={fiveColours2.current}
                    />
              <CirclePicker id="tagColour3"
                        color={colour}
                        onChangeComplete={(color)=>{setColour(color.hex)}}
                        colors={fiveColours3.current}
                    />
            </Flex> */}
            <Flex
              // mih={20}
              mt={15}
              mr={35}
              gap="md"
              direction="row"
              wrap="wrap"
              justify="center"
              align="center"
            >
              <Button variant="text" type="submit">Create Tag</Button>
            </Flex>
          </form>
          </Grid.Col>
          <Grid.Col span={1} />
      </Grid>
      </GenericModal>
        {/* <Button onClick={handleOpen}>Create a tag</Button>
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
        </Modal> */}
    </>
    );
}