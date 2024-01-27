
import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { createNoteCommentSchema, createCommentReplySchema } from '../../Utils/yupSchemas';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutations } from '../../customHooks/useMutations';
import { fetchCommentsPerNoteId } from '../../Utils/Queries';
import { useQuery } from "react-query"
import Comment from '../Components/Comment';
import { handleNoteCommentSubmit } from '../../Utils/Utils';
import { handleDeleteOneNote } from '../../Utils/Utils';
import { IconTrash, IconEdit, IconCircleFilled } from '@tabler/icons-react';
import ConfirmationPopup from './ConfirmationPopup';
import {
	Box,
	Breadcrumbs,
	Card,
	Divider,
	Flex,
	Grid,
	Group,
	Text,
	Title,
	LoadingOverlay,
	Button,
	Image,
	Center,
	Modal,
	Loader,
	Textarea,
	ScrollArea,
	ActionIcon
} from '@mantine/core';
import { format } from "date-fns"
import { useAuth } from '../../customHooks/useAuth';
import { GenericModal } from './GenericModal';
import { AppDataContext } from '../../context/AppDataContext';

const ViewNoteDetailsDialog = ({
	actionComponent,
	noteId,
	noteContent,
	noteSources,
	noteTags
}) => {
	const {user} = useAuth()
	const { allProjectNotes, setAllProjectNotes } = useContext(AppDataContext)
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState([])
	const [isFetchingComments, setIsFetchingComments] = useState(false)
	const {createCommentMutation,invalid, deleteNoteMutation} = useMutations()
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
	const actionComponentWithOnClick = React.cloneElement(actionComponent, { onClick: (e)=>{e.preventDefault(); handleOpen()} });


	const handleClose = () => {
		setOpen(false);
	};

	const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
		resolver:yupResolver(createNoteCommentSchema) 
	})
	return (
		<div>
			{/* <Card
				shadow="sm"
				padding="lg"
				radius="md"
				withBorder
				onClick={handleOpen}
				w={'100%'}
				h={'100%'}
				styles={{ root: { cursor:'pointer' } }}
			>
				<Flex
				gap="md"
				align="flex-start"
				direction="row"
				wrap="wrap"
				justify={'space-between'}
				>
					<Text truncate="end" size="sm" c="dimmed">
						{format(new Date(noteDateCreated), "yyyy/MM/dd")}
					</Text>

					<Text truncate="end" size="sm" c="dimmed"  >
						{noteCreatedBy}
					</Text>
				</Flex>
				<Flex
				mt={'lg'}
				gap="md"
				direction="row"
				wrap="wrap"
				>
				<Text lineClamp={3} fw={500} styles={{ root: { wordBreak: 'break-word' } }}>
					{noteContent}
				</Text>
				</Flex>
			</Card> */}
				{actionComponentWithOnClick}
				<GenericModal opened={open} close={handleClose} title={'Note Details'} >
				<Grid columns={20}>
					<Grid.Col span={1}></Grid.Col>
					<Grid.Col span={'auto'}>
					<Flex
						align="flex-start"
						direction="row"
						wrap="wrap"
						justify="space-between"
						>
						<Text truncate="end" size="sm" c="dimmed" mb={10}  >
							Note Content
						</Text>
						<ActionIcon variant='subtle' aria-label="edit note">
							<IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
						</ActionIcon>
					</Flex>
						
						<Flex
						mt={'lg'}
						gap="md"
						direction="row"
						wrap="wrap"
						>
							<Text lineClamp={3} fw={500} styles={{ root: { wordBreak: 'break-word' } }}>{noteContent}</Text>
						</Flex>
						<Divider my={'sm'} />
						{noteSources.length > 0 &&
						<>
						<Grid>
							<Grid.Col span={6}>
								<Text truncate="end" size="sm" c="dimmed"  >
									Source
								</Text>
							</Grid.Col>
							<Grid.Col span={6}>
								<Text size="sm" c="dimmed"  >
									Additional Source Information
								</Text>
							</Grid.Col>
						
						{noteSources.map((source, i) => {
							return (
								<React.Fragment key={i}>
									<Grid.Col span={6}>
										<Text fw={500} >{source.source}</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text fw={500} styles={{ root: { wordBreak: 'break-word' } }}>{source.additionalSourceInformation}</Text>
									</Grid.Col>
								</React.Fragment>
							);
						})}
						</Grid>
						<Divider my={'sm'} />
						</>}
						{noteTags.length > 0 && 
						<>
							<Text truncate="end" size="sm" c="dimmed" mb={10}  >
								Tags
							</Text>
							<Grid columns={15}>
								{noteTags.map((tag, i) => {
									return (
										<React.Fragment key={i}>
											<Grid.Col span={2}>
												<span style={{color:tag.colour}}><IconCircleFilled /></span>
											</Grid.Col>
											<Grid.Col span={13}>
												<Text fw={500} >{tag.tagName}</Text>
											</Grid.Col>
										</React.Fragment>
									);
								})}
							</Grid>
							<Divider my={'sm'} />
						</>
						}
						{commentTree.length > 0 &&
						<>
							<Text truncate="end" size="sm" c="dimmed" mb={10} >
								Comments
							</Text>
							{isFetchingComments 
							?
							<Center>
								<Loader color="blue" />
							</Center>
							:
							<>
								{
									commentTree.map((comment,i)=>{
										return <Comment key={i} comment={comment} noteId={noteId} setComments={setComments} comments={comments} />
									})
								}
							</>
							}
							<Divider my={'sm'} />
						</>
						}
						<form
						onSubmit={handleSubmit((data)=>{handleNoteCommentSubmit(data, noteId,createCommentMutation,setValue,setComments, comments)})}>
							<Textarea
								variant='filled'
								withAsterisk
								error={errors.noteComment ? true : false}
								placeholder={errors.noteComment?.message || 'Your comment'}
								id="noteComment"
								label="Note Commment"
								{...register("noteComment")}
							/>
							<Flex
								align="flex-start"
								direction="row"
								wrap="wrap"
								justify="space-between"
							>
							<Button type="submit" variant='light ' size='xs' mt={'sm'}  >
								<Text size='sm' >Add Comment</Text>
							</Button>
							{/* <ActionIcon variant='light' aria-label="delete note" mt={'sm'} onClick={() => handleDeleteOneNote(allProjectNotes,setAllProjectNotes,noteId,deleteNoteMutation)}>
								<IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
							</ActionIcon> */}
							<ConfirmationPopup
									actionComponent={
										<ActionIcon variant='light' aria-label="delete note" mt={'sm'}>
											<IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
										</ActionIcon>
									}
									title="Delete Note"
									message={
										<Text> Are you sure you want to delete this note? This action is irreversible!</Text>
									}
									onConfirm={() => handleDeleteOneNote(allProjectNotes,setAllProjectNotes,noteId,deleteNoteMutation)}
								/>
							</Flex>
					</form>
					</Grid.Col>
					<Grid.Col span={1}></Grid.Col>
				</Grid>
				</GenericModal>

			{/* <Button variant="text" color="primary" onClick={handleOpen}>
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
			</Dialog> */}
		</div>
	);
};

export default ViewNoteDetailsDialog;
