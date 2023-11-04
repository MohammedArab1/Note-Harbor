import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Box, useMediaQuery } from '@mui/material';
import { createNoteCommentSchema } from '../../Utils/yupSchemas';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutations } from '../../customHooks/useMutations';

const ViewNoteDetailsDialog = ({
	name,
	noteId,
	noteContent,
	noteCreatedBy,
	noteDateCreated,
	noteSources,
}) => {
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
	const [open, setOpen] = useState(false);
	const {createCommentMutation,invalid} = useMutations()

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
		resolver:yupResolver(createNoteCommentSchema) 
	})

	const handleNoteCommentSubmit = (data, noteId) => {
		console.log("submitted comment. data is: ", data, "note id is: ", noteId)
		//todo handle create comment properly
		// createCommentMutation.mutate({content:data.noteComment,note:noteId }, {
		// 	// onSuccess: (data) => {
		// 	// 	setAllProjectNotes([...allProjectNotes, data])
		// 	// 	setOpen(false)
		// 	// 	setValue("content", "")
		// 	// }
		// })
	}

	return (
		<div>
			<Button variant="text" color="primary" onClick={handleOpen}>
				{name}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Note Details</DialogTitle>
				<DialogContent>
					<DialogContentText>Note Content: {noteContent}</DialogContentText>
					<DialogContentText>Note Creator: {noteCreatedBy}</DialogContentText>
					<DialogContentText>
						Note Date Created: {noteDateCreated}
					</DialogContentText>
					<DialogContentText>Note sources: </DialogContentText>
					<ol>
						{noteSources.map((source, i) => {
							return (
								<li key={i}>
									<p>source name: {source.source}</p>
									<p>
										source additional information:{' '}
										{source.additionalSourceInformation}
									</p>
								</li>
							);
						})}
					</ol>
					<DialogContentText>Add a Comment</DialogContentText>
					<Box
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={handleSubmit((data)=>{handleNoteCommentSubmit(data, noteId)})}>
						<TextField 
							multiline
							error={errors.noteComment ? true : false}
							helperText={errors.noteComment?.message}
							id="noteComment"
							required
							label="Note Commment"
							{...register("noteComment")}
						/>
						<Button variant="text" type="submit">Add Comment</Button>
					</Box>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ViewNoteDetailsDialog;
