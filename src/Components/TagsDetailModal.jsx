import { ActionIcon, Box, Divider, Flex, Grid, Text } from '@mantine/core';
import { IconCircleFilled, IconTrash } from '@tabler/icons-react';
import React, { useContext } from 'react';
import { handleDeleteOneTag } from '../../Utils/Utils';
import { AppDataContext } from '../../context/AppDataContext';
import { useMutations } from '../../customHooks/useMutations';
import ConfirmationPopup from './ConfirmationPopup';
import { GenericModal } from './GenericModal';
import ViewNoteDetailsDialog from './ViewNoteDetailsDialog';

export const TagsDetailModal = ({ opened, close }) => {
	const { tags, setTags } = useContext(AppDataContext);
	const { deleteTagMutation } = useMutations();
	return (
		<GenericModal opened={opened} close={close} title="Tags">
			<Grid>
				<Grid.Col span={1} />
				<Grid.Col span={10}>
					{tags.length === 0 && (
						<Text>
							You don't have any tags yet, create one first and you will see its
							details in this modal.
						</Text>
					)}
					{tags.map((tag) => {
						const noteStrings = tag.notes.map((note) => note._id);
						return (
							<React.Fragment key={tag._id}>
								<Box
									style={{ backgroundColor: '#e3e1e1', borderRadius: '5px' }}
								>
									<Grid>
										<Grid.Col span={10} ml={5}>
											<span>{tag.tagName}</span>
										</Grid.Col>
										<Grid.Col span={1}>
											<span style={{ color: tag.colour }}>
												<IconCircleFilled />
											</span>
										</Grid.Col>
									</Grid>
									{tag.notes.length > 0 && (
										<>
											<Divider
												my={'sm'}
												w={'80%'}
												style={{ justifyItems: 'center' }}
											/>
											<Text ml={5}>Notes associated with this tag:</Text>
											{tag.notes.map((note) => {
												const noteTags = tags.filter((tag) =>
													tag.notes.some((n) => n._id === note._id)
												);
												return (
													<React.Fragment key={tag._id+"_"+note._id}>
														<ol>
															<li>
																<ViewNoteDetailsDialog
																	noteContent={note.content}
																	noteId={note._id}
																	noteCreatedBy={
																		note.user?.firstName
																			? note.user?.firstName +
																			  ' ' +
																			  note.user?.lastName
																			: ''
																	}
																	noteDateCreated={note.dateCreated}
																	noteSources={note.sources}
																	noteTags={noteTags}
																	actionComponent={
																		<a href="#">{note.content}</a>
																	}
																></ViewNoteDetailsDialog>
															</li>
														</ol>
													</React.Fragment>
												);
											})}
										</>
									)}
									<Flex
										p={5}
										gap="md"
										justify="flex-end"
										direction="row"
										wrap="wrap"
									>
										<ConfirmationPopup
											actionComponent={
												<ActionIcon
													variant="light"
													aria-label="delete tag"
													mt={'sm'}
												>
													<IconTrash
														style={{ width: '70%', height: '70%' }}
														stroke={1.5}
													/>
												</ActionIcon>
											}
											title="Delete Tag"
											message={
												<Text m={10}>
													{' '}
													Are you sure you want to delete this tag? Any relevant
													note will no longer be tagged with this tag.
												</Text>
											}
											onConfirm={() =>
												handleDeleteOneTag(
													tags,
													setTags,
													tag._id,
													deleteTagMutation
												)
											}
										/>
									</Flex>
								</Box>
								<br />
							</React.Fragment>
						);
					})}
				</Grid.Col>
				<Grid.Col span={1} />
			</Grid>
		</GenericModal>
	);
};

export default TagsDetailModal;
