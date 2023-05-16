import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { createMeetupSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



export const CreateMeetupModal = ({meetups,setMeetups, groupId}) => {

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
  const {createMeetupMutation, invalid} = useMutations()
  const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
    resolver:yupResolver(createMeetupSchema) 
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateMeetup= async(data) => {
    // const {groupName, description} = data
    // createMeetupMutation.mutate({}, {
    //   onSuccess: (data) => {
    //     setGroups([...meetups, data])
    //     setOpen(false)
    //     setValue("groupName", "")
    //     setValue("description", "")
    //   }
    // })
    var {name, description, dateToPickFrom, dateToPickTo, location, minPplNeeded, numOfDatesToPick, deadLine} = data
    minPplNeeded = {
      type:"absolute",
      value:minPplNeeded
    }
    createMeetupMutation.mutate({name, deadLine, description, dateToPickFrom, dateToPickTo, location, minPplNeeded, numOfDatesToPick, groupId}, {
      onSuccess: (data) => {
        setMeetups([...meetups, data])
        setOpen(false)
        setValue("meetupName", "")
        setValue("description", "")
        setValue("dateToPickFrom", "")
        setValue("dateToPickTo", "")
        setValue("location", "")
        setValue("minPplNeeded", "")
        setValue("numOfDatesToPick", "")
      }
    })
  }
  return (
    <div>
        <Button onClick={handleOpen}>Create a meetup</Button>
        <Modal
        open={open}
        onClose={handleClose}
        >
            <Box sx={style}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit((data)=>{handleCreateMeetup(data)})}
            >
                {invalid.isInvalid && <p>{invalid.message}</p>}
                <TextField
                error={errors.name ? true : false}
                helperText={errors.name?.message}
                required
                id="name"
                label="Meetup Name"
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
                
                <Controller
                    name="dateToPickFrom"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <DatePicker
                        label="Earliest date to meet"
                        slotProps={{ 
                          textField: { 
                            variant: 'outlined', error: errors.dateToPickFrom ? true : false, helperText:errors.dateToPickFrom?.message
                        }}}
                        {...field}
                        />
                    )}
                />
                <Controller
                    name="dateToPickTo"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                        <DatePicker
                        label="Latest date to meet"
                        slotProps={{ 
                          textField: { 
                            variant: 'outlined', error: errors.dateToPickTo ? true : false, helperText:errors.dateToPickTo?.message
                        }}}
                        {...field}
                        />
                    )}
                />

                <TextField
                  error={errors.location ? true : false}
                  helperText={errors.location?.message}
                  id="location"
                  label="Location"
                  {...register("location")}
                />      
                <TextField
                  error={errors.minPplNeeded ? true : false}
                  helperText={errors.minPplNeeded?.message}
                  id="minPplNeeded"
                  label="Minimum people needed"
                  type="number"
                  required
                  {...register("minPplNeeded")}
                />
                <TextField
                  error={errors.numOfDatesToPick ? true : false}
                  helperText={errors.numOfDatesToPick?.message}
                  id="numOfDatesToPick"
                  label="Minimum number of dates to be picked"
                  type="number"
                  required
                  {...register("numOfDatesToPick")}
                />

                <Controller
                  name="deadLine"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                      <DatePicker
                      label="Deadline for members to respond"
                      slotProps={{ 
                        textField: { 
                          variant: 'outlined', error: errors.deadLine ? true : false, helperText:errors.deadLine?.message
                      }}}
                      {...field}
                      />
                  )}
                />

                <Button variant="text" type="submit">Create meetup</Button>
            </Box>
        </Modal>
    </div>
    );
}