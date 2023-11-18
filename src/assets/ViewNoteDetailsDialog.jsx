import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Box, useMediaQuery } from '@mui/material';
import { createNoteCommentSchema, createCommentReplySchema } from '../../Utils/yupSchemas';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutations } from '../../customHooks/useMutations';
import { fetchCommentsPerNoteId } from '../../Utils/Queries';
import { useQuery } from "react-query"
import Comment from '../Components/Comment';
import { handleNoteCommentSubmit } from '../../Utils/Utils';

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
	const [comments, setComments] = useState([])
	const [isFetchingComments, setIsFetchingComments] = useState(false)
	const {createCommentMutation,invalid} = useMutations()
	const [commentTree, setCommentTree] = useState([])

	function createCommentTree(comments) {
		let commentMap = {};
		comments.forEach(comment => commentMap[comment._id] = {...comment, children: []});
		let commentTree = [];
		comments.forEach(comment => {
			if(comment.inReplyTo) {
				commentMap[comment.inReplyTo._id].children.push(commentMap[comment._id]);
			} else {
				commentTree.push(commentMap[comment._id]);
			}
		});
	
		return commentTree;
	}

	useEffect(() => {
		setCommentTree(createCommentTree(comments))
	}, [comments])
	

	const handleOpen = async () => {
		setOpen(true);
		setIsFetchingComments(true)
		fetchCommentsPerNoteId(noteId).then((data) =>{
			setComments(data)
		}).catch(()=>{
			setOpen(false)
		})
		.finally(()=>{
			setIsFetchingComments(false) //todo should note have a set in a finally, what if open is false? can't set state when 
			// component is unmounted
		})
	};

	const handleClose = () => {
		setOpen(false);
	};

	const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
		resolver:yupResolver(createNoteCommentSchema) 
	})

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
					onSubmit={handleSubmit((data)=>{handleNoteCommentSubmit(data, noteId,createCommentMutation,setValue,setComments, comments)})}>
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
					{isFetchingComments 
					?
					<p>loading comments...</p>
					:
						<>
							<h3>
								comments:
							</h3>
							<ol>
								{
									commentTree.map((comment,i)=>{
										return <Comment key={i} comment={comment} noteId={noteId} setComments={setComments} comments={comments} />
									})
								}
							</ol>
						</>
					}
					
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ViewNoteDetailsDialog;
