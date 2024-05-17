import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	Divider,
	Flex,
	Grid,
	Group,
	LoadingOverlay,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBarLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	applyFilter,
	getUniqueSources,
	isOfflineMode,
	isUserLeader,
} from '../../Utils/Utils';
import { AppDataContext } from '../../context/AppDataContext';
import { useAuth } from '../../customHooks/useAuth';
import { useMutations } from '../../customHooks/useMutations';
import ConfirmationPopup from '../Components/ConfirmationPopup';
import { CreateNoteModal } from '../Components/CreateNoteModal';
import { CreateSubSectionModal } from '../Components/CreateSubSectionModal';
import { CreateTagModal } from '../Components/CreateTagModal';
import NoteDetailsCard from '../Components/NoteDetailsCard';
import { SourceMultiSelect } from '../Components/SourceMultiSelect';
import { TagMultiSelect } from '../Components/TagMultiSelect';
import { TagsDetailModal } from '../Components/TagsDetailModal';
import ViewNoteDetailsDialog from '../Components/ViewNoteDetailsDialog';

const ProjectDetails = () => {
	const {
		tags,
		setTags,
		allProjectNotes,
		setAllProjectNotes,
		project,
		setProject,
		subSections,
		setSubSections,
	} = useContext(AppDataContext);
	const [uniqueSources, setUniqueSources] = useState([]);
	const [searching, setSearching] = useState(false);
	const [selectTags, setSelectTags] = useState([]);
	const [filterValues, setFilterValues] = useState({
		searchString: '',
		selectedSources: [],
		selectedTags: [],
	});
	const [createNoteModalOpened, createNoteModalHandler] = useDisclosure(false);
	const [viewTagsModalOpened, viewTagsModalHandler] = useDisclosure(false);
	const [createTagModalOpened, createTagModalHandler] = useDisclosure(false);
	const [createSubsectionModalOpened, createSubsectionModalHandler] =
		useDisclosure(false);
	const {
		deleteProjectMutation,
		invalid,
		leaveProjectMutation,
		deleteNoteMutation,
		deleteSubSectionMutation,
		deleteTagMutation,
	} = useMutations();
	const { user } = useAuth();
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [notes, setNotes] = useState(null);
	const projectLeaderLeaveMessage = (
		<Text m={10}>
			Are you sure you want to leave this Project? Since you are the project
			leader, a random member will be appointed project leader after you leave.
		</Text>
	);
	const projectLeaderDeleteMessage = (
		<Text m={10}>Are you sure you want to delete this project?</Text>
	);
	const handleLeaveProject = (userToBeDeletedId) => {
		const newProject = {
			...project,
			members: project.members.filter(
				(member) => member._id !== userToBeDeletedId
			),
		};
		if (project.leader._id === userToBeDeletedId) {
			const newLeader =
				newProject.members[
					Math.floor(Math.random() * newProject.members.length)
				];
			newProject.leader = newLeader;
		}
		leaveProjectMutation.mutate({ projectId: newProject._id, newProject });
	};
	useEffect(() => {
		setUniqueSources(getUniqueSources(allProjectNotes));
		setNotes(
			allProjectNotes.filter((x) => {
				return x.project != null;
			})
		);
	}, [allProjectNotes]);
	useEffect(() => {
		setSelectTags(
			tags.map((tag) => {
				return {
					value: tag._id,
					label: tag.tagName,
					color: tag.colour,
				};
			})
		);
	}, [tags]);
	const breadcrumbs = [
		{ title: 'Home', href: '/UserHome' },
		{ title: `${project.projectName}`, href: `/ProjectDetails/${project._id}` },
	].map((item, index) => (
		<Link to={item.href} key={index}>
			{item.title}
		</Link>
	));
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Breadcrumbs>{breadcrumbs}</Breadcrumbs>
			<Button
				mt="lg"
				leftSection={<IconArrowBarLeft />}
				variant="transparent"
				component={Link}
				to="/UserHome"
				c={'black'}
			>
				Go back
			</Button>
			<Grid columns={17}>
				<Grid.Col span={{ base: 12 }} mt={'md'}>
					<Title order={1}>{project.projectName}</Title>
					<Text
						w={'100%'}
						styles={{ root: { wordBreak: 'break-word' } }}
						mt={'lg'}
					>
						{project.description}
					</Text>
					<Title mt={'lg'} order={2}>
						SubSections
					</Title>
					<Grid mt={'lg'}>
						{subSections.length < 1 && (
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Text>No subsections yet... create one!</Text>
							</Grid.Col>
						)}
						{subSections.map((subsection, i) => {
							return (
								<Grid.Col span={{ base: 12, md: 6 }} key={i}>
									<Card
										shadow="sm"
										padding="lg"
										radius="md"
										withBorder
										component={Link}
										to={`/ProjectDetails/${projectId}/SubSectionDetails/${subsection._id}`}
										h="100%"
										w="100%"
										c="gray"
									>
										<Group>
											<Text truncate="end" fw={500}>
												{subsection.name}
											</Text>
										</Group>
										<Divider mt="sm" mb="md" />
										<Box maw="100%">
											<Text
												lineClamp={3}
												size="sm"
												c="dimmed"
												styles={{ root: { wordBreak: 'break-word' } }}
											>
												{subsection.description || 'No description'}
											</Text>
										</Box>
									</Card>
								</Grid.Col>
							);
						})}
					</Grid>
					<Button
						mt={10}
						onClick={(e) => {
							createSubsectionModalHandler.open();
						}}
					>
						Create a Subsection
					</Button>
					<CreateSubSectionModal
						subSections={subSections}
						setSubSections={setSubSections}
						projectId={projectId}
						opened={createSubsectionModalOpened}
						close={createSubsectionModalHandler.close}
					></CreateSubSectionModal>
					<Title order={2} mt={'lg'}>
						Notes
					</Title>
					<Grid mt={'lg'}>
						{notes?.map((note, i) => {
							return (
								<Grid.Col span={{ base: 12, md: 6 }} key={i}>
									<ViewNoteDetailsDialog
										noteContent={note.content}
										noteId={note._id}
										noteSources={note.sources}
										noteTags={note.tags}
										actionComponent={
											<NoteDetailsCard
												noteDateCreated={note.dateCreated}
												noteCreatedBy={
													note.user?.firstName
														? note.user?.firstName + ' ' + note.user?.lastName
														: ''
												}
												noteContent={note.content}
											></NoteDetailsCard>
										}
									></ViewNoteDetailsDialog>
								</Grid.Col>
							);
						})}
					</Grid>
					<Button
						mt={10}
						onClick={(e) => {
							createNoteModalHandler.open();
						}}
					>
						Add a Note
					</Button>
					<CreateNoteModal
						projectId={projectId}
						opened={createNoteModalOpened}
						close={createNoteModalHandler.close}
					></CreateNoteModal>
					<Flex
						mih={20}
						mt={15}
						gap="md"
						justify="flex-start"
						align="flex-start"
						direction="row"
						wrap="wrap"
					>
						{(isUserLeader(project?.leader?._id) || isOfflineMode()) && (
							<ConfirmationPopup
								actionComponent={<Button>Delete Project</Button>}
								title="Delete project"
								message={projectLeaderDeleteMessage}
								onConfirm={() => deleteProjectMutation.mutate(projectId)}
							/>
						)}
						{project?.members?.length > 1 &&
							!isOfflineMode() &&
							(isUserLeader(project?.leader?._id) ? (
								<ConfirmationPopup
									actionComponent={<Button>Leave Project</Button>}
									title="Leave project"
									message={projectLeaderLeaveMessage}
									onConfirm={() => handleLeaveProject(user.id)}
								/>
							) : (
								<Button
									variant="light"
									type="button"
									onClick={() => handleLeaveProject(user.id)}
								>
									Leave project
								</Button>
							))}
					</Flex>
				</Grid.Col>
				<Grid.Col span={{ base: 'content' }}>
					<Divider w="100%" h="100%" orientation="vertical" />
				</Grid.Col>
				<Grid.Col span={{ base: 'auto' }}>
					<Title ta="center" order={2}>
						Filters
					</Title>
					<TextInput
						placeholder={'Your search filter here...'}
						id="searchString"
						label="Search for notes by content"
						radius="md"
						value={filterValues.searchString}
						onChange={(e) => {
							setFilterValues({
								...filterValues,
								searchString: e.target.value,
							});
						}}
					/>
					<SourceMultiSelect
						value={filterValues.selectedSources}
						setValue={(value) => {
							setFilterValues({ ...filterValues, selectedSources: value });
						}}
						sourceData={uniqueSources}
					/>
					<TagMultiSelect
						value={filterValues.selectedTags}
						setValue={(value) => {
							setFilterValues({ ...filterValues, selectedTags: value });
						}}
						tagData={selectTags}
					/>
					<br />
					<Flex
						mih={20}
						mt={15}
						gap="md"
						justify="space-between"
						align="flex-start"
						direction="row"
						wrap="wrap"
					>
						<Button
							onClick={() => {
								setSearching(true);
								setNotes(applyFilter(allProjectNotes, filterValues));
								setSearching(false);
							}}
						>
							Search
						</Button>
						<Button
							onClick={() => {
								setFilterValues({
									searchString: '',
									selectedSources: [],
									selectedTags: [],
								});
								setNotes(
									allProjectNotes.filter((x) => {
										return x.project != null;
									})
								);
							}}
						>
							Clear Filters
						</Button>
					</Flex>
					<LoadingOverlay
						visible={searching}
						zIndex={1000}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<Flex
						mih={20}
						mt={15}
						gap="md"
						justify="space-between"
						align="flex-start"
						direction="row"
						wrap="wrap"
					>
						<TagsDetailModal
							opened={viewTagsModalOpened}
							close={viewTagsModalHandler.close}
						></TagsDetailModal>
						<CreateTagModal
							tags={tags}
							setTags={setTags}
							projectId={projectId}
							opened={createTagModalOpened}
							close={createTagModalHandler.close}
						/>
						<Button
							variant="light"
							onClick={() => createTagModalHandler.open()}
						>
							Create a Tag
						</Button>
						<Button onClick={() => viewTagsModalHandler.open()}>
							View Tags
						</Button>
					</Flex>
				</Grid.Col>
			</Grid>
		</motion.div>
	);
};

export default ProjectDetails;
