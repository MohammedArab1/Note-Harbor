import { yupResolver } from '@hookform/resolvers/yup';
import {
	ActionIcon,
	Button,
	Center,
	Divider,
	Flex,
	Grid,
	Loader,
	Text,
	Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleFilled, IconEdit, IconTrash } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AppDataContext } from '../../context/AppDataContext';
import { useAuth } from '../../customHooks/useAuth';
import { useMutations } from '../../customHooks/useMutations';
import { fetchCommentsPerNoteId } from '../../Utils/Queries';
import {
	handleDeleteOneNote,
	handleNoteCommentSubmit,
} from '../../Utils/Utils';
import {
	createNoteCommentSchema,
	createNoteSchema,
} from '../../Utils/yupSchemas';
import Comment from './Comment';
import ConfirmationPopup from './ConfirmationPopup';
import { EditNoteModal } from './EditNoteModal';
import { GenericModal } from './GenericModal';

const ViewNoteDetailsDialog = ({
	actionComponent,
	noteId,
	noteContent,
	noteSources,
	noteTags,
}) => {
	const { user } = useAuth();
	const { projectId } = useParams();
	const [editNoteClicked, editNoteHandler] = useDisclosure(false);
	const { allProjectNotes, setAllProjectNotes } = useContext(AppDataContext);
	const [open, setOpen] = useState(false);
	const [comments, setComments] = useState([]);
	const [isFetchingComments, setIsFetchingComments] = useState(false);
	const { createCommentMutation, invalid, deleteNoteMutation } = useMutations();
	const [commentTree, setCommentTree] = useState([]);

	function createCommentTree(comments) {
		let commentMap = {};
		comments.forEach(
			(comment) => (commentMap[comment._id] = { ...comment, children: [] })
		);
		let commentTree = [];
		comments.forEach((comment) => {
			if (comment.inReplyTo) {
				commentMap[comment.inReplyTo._id].children.push(
					commentMap[comment._id]
				);
			} else {
				commentTree.push(commentMap[comment._id]);
			}
		});

		return commentTree;
	}

	useEffect(() => {
		setCommentTree(createCommentTree(comments));
	}, [comments]);

	const handleOpen = async () => {
		setOpen(true);
		setIsFetchingComments(true);
		fetchCommentsPerNoteId(noteId)
			.then((data) => {
				setComments(data);
			})
			.catch(() => {
				setOpen(false);
			})
			.finally(() => {
				setIsFetchingComments(false); //todo should note have a set in a finally, what if open is false? can't set state when
				// component is unmounted
			});
	};
	const actionComponentWithOnClick = React.cloneElement(actionComponent, {
		onClick: (e) => {
			e.preventDefault();
			handleOpen();
		},
	});

	const handleClose = () => {
		setOpen(false);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(createNoteCommentSchema),
	});
	const {
		register: registerEdit,
		handleSubmit: handleSubmitEdit,
		formState: { errors: errorsEdit },
		setValue: setValueEdit,
	} = useForm({
		resolver: yupResolver(createNoteSchema),
	});

	useEffect(() => {
		setValueEdit('editNote', noteContent);
	}, [noteContent, setValueEdit, editNoteClicked]);
	return (
		<div>
			{actionComponentWithOnClick}
			<GenericModal opened={open} close={handleClose} title={'Note Details'}>
				<Grid columns={20}>
					<Grid.Col span={1}></Grid.Col>
					<Grid.Col span={'auto'}>
						<Flex
							align="flex-start"
							direction="row"
							wrap="wrap"
							justify="space-between"
						>
							<Text truncate="end" size="sm" c="dimmed" mb={10}>
								Note Content
							</Text>
							<ActionIcon
								variant="subtle"
								aria-label="edit note"
								onClick={(e) => {
									!editNoteClicked
										? editNoteHandler.open()
										: editNoteHandler.close();
								}}
							>
								<IconEdit
									style={{ width: '70%', height: '70%' }}
									stroke={1.5}
								/>
							</ActionIcon>
						</Flex>
						<div>
							<Flex gap="md" direction="row" wrap="wrap">
								<Text
									lineClamp={3}
									fw={500}
									styles={{ root: { wordBreak: 'break-word' } }}
								>
									{noteContent}
								</Text>
							</Flex>
							<Divider my={'sm'} />
							{noteSources.length > 0 && (
								<>
									<Grid>
										<Grid.Col span={6}>
											<Text truncate="end" size="sm" c="dimmed">
												Source
											</Text>
										</Grid.Col>
										<Grid.Col span={6}>
											<Text size="sm" c="dimmed">
												Additional Source Information
											</Text>
										</Grid.Col>

										{noteSources.map((source, i) => {
											return (
												<React.Fragment key={i}>
													<Grid.Col span={6}>
														<Text fw={500}>{source.source}</Text>
													</Grid.Col>
													<Grid.Col span={6}>
														<Text
															fw={500}
															styles={{ root: { wordBreak: 'break-word' } }}
														>
															{source.additionalSourceInformation}
														</Text>
													</Grid.Col>
												</React.Fragment>
											);
										})}
									</Grid>
									<Divider my={'sm'} />
								</>
							)}
						</div>
						<EditNoteModal
							noteId={noteId}
							projectId={projectId}
							opened={editNoteClicked}
							close={editNoteHandler.close}
							initialNoteContent={noteContent}
							initialSource={noteSources[0]?.source || ''}
							initialAdditionalSourceInfo={
								noteSources[0]?.additionalSourceInformation || ''
							}
							initialTags={noteTags}
						></EditNoteModal>
						{noteTags?.length > 0 && (
							<>
								<Text truncate="end" size="sm" c="dimmed" mb={10}>
									Tags
								</Text>
								<Grid columns={15}>
									{noteTags.map((tag, i) => {
										return (
											<React.Fragment key={i}>
												<Grid.Col span={2}>
													<span style={{ color: tag.colour }}>
														<IconCircleFilled />
													</span>
												</Grid.Col>
												<Grid.Col span={13}>
													<Text fw={500}>{tag.tagName}</Text>
												</Grid.Col>
											</React.Fragment>
										);
									})}
								</Grid>
								<Divider my={'sm'} />
							</>
						)}
						{commentTree.length > 0 && (
							<>
								<Text truncate="end" size="sm" c="dimmed" mb={10}>
									Comments
								</Text>
								{isFetchingComments ? (
									<Center>
										<Loader color="blue" />
									</Center>
								) : (
									<>
										{commentTree.map((comment, i) => {
											return (
												<Comment
													key={i}
													comment={comment}
													noteId={noteId}
													setComments={setComments}
													comments={comments}
												/>
											);
										})}
									</>
								)}
								<Divider my={'sm'} />
							</>
						)}
						<form
							onSubmit={handleSubmit((data) => {
								handleNoteCommentSubmit(
									data,
									noteId,
									createCommentMutation,
									setValue,
									setComments,
									comments
								);
							})}
						>
							<Textarea
								variant="filled"
								withAsterisk
								error={errors.noteComment ? true : false}
								placeholder={errors.noteComment?.message || 'Your comment'}
								id="noteComment"
								label="Note Commment"
								{...register('noteComment')}
							/>
							<Flex
								align="flex-start"
								direction="row"
								wrap="wrap"
								justify="space-between"
							>
								<Button type="submit" variant="light " size="xs" mt={'sm'}>
									<Text size="sm">Add Comment</Text>
								</Button>

								<ConfirmationPopup
									actionComponent={
										<ActionIcon
											variant="light"
											aria-label="delete note"
											mt={'sm'}
										>
											<IconTrash
												style={{ width: '70%', height: '70%' }}
												stroke={1.5}
											/>
										</ActionIcon>
									}
									title="Delete Note"
									message={
										<Text>
											{' '}
											Are you sure you want to delete this note? This action is
											irreversible!
										</Text>
									}
									onConfirm={() =>
										handleDeleteOneNote(
											allProjectNotes,
											setAllProjectNotes,
											noteId,
											deleteNoteMutation
										)
									}
								/>
							</Flex>
						</form>
					</Grid.Col>
					<Grid.Col span={1}></Grid.Col>
				</Grid>
			</GenericModal>
		</div>
	);
};

export default ViewNoteDetailsDialog;
