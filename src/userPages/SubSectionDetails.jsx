import { Breadcrumbs, Button, Divider, Grid, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBarLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppDataContext } from '../../context/AppDataContext';
import { useAuth } from '../../customHooks/useAuth';
import { useMutations } from '../../customHooks/useMutations';
import { handleDeleteOneSubSection } from '../../Utils/Utils';
import ConfirmationPopup from '../Components/ConfirmationPopup';
import { CreateNoteModal } from '../Components/CreateNoteModal';
import { Filter } from '../Components/Filter';
import NoteDetailsCard from '../Components/NoteDetailsCard';
import ViewNoteDetailsDialog from '../Components/ViewNoteDetailsDialog';

const SubSectionDetails = () => {
	const [createNoteModalOpened, createNoteModalHandler] = useDisclosure(false);
	const {
		allProjectNotes,
		setAllProjectNotes,
		subSections,
		project,
		tags,
		setSubSections,
	} = useContext(AppDataContext);
	const { invalid, deleteNoteMutation, deleteSubSectionMutation } =
		useMutations();
	const { user } = useAuth();
	const { subSectionId, projectId } = useParams();
	const navigate = useNavigate();
	const [subSection, setsubSection] = useState({});
	const [subSectionNotes, setSubSectionNotes] = useState([]);
	const [notes, setNotes] = useState([]);
	const deleteSubsectionMessage = (
		<Text m={10}>Are you sure you want to delete this Subsection?</Text>
	);
	useEffect(() => {
		if (!subSectionId) {
			return navigate('/UserHome');
		}
	}, []);
	useEffect(() => {
		const specificSubSection = subSections.find((x) => {
			return x._id == subSectionId;
		});
		if (!specificSubSection) {
			return navigate('/UserHome');
		}
		setsubSection(specificSubSection);
		setNotes(
			allProjectNotes.filter((x) => {
				return x.project == null && x.subSection == subSectionId;
			})
		);
		setSubSectionNotes(
			allProjectNotes.filter((x) => {
				return x.project == null && x.subSection == subSectionId;
			})
		);
	}, [allProjectNotes]);
	const breadcrumbs = [
		{ title: 'Home', href: '/UserHome' },
		{ title: `${project.projectName}`, href: `/ProjectDetails/${project._id}` },
		{
			title: `${subSection.name}`,
			href: `/ProjectDetails/${project._id}/SubSectionDetails/${subSection._id}`,
		},
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
				to={`/ProjectDetails/${project._id}`}
				c={'black'}
			>
				Go back
			</Button>
			<Grid columns={17}>
				<Grid.Col span={{ base: 'auto', md: 12 }} mt={'md'}>
					<Title styles={{ root: { wordBreak: 'break-word' } }} order={1}>
						{subSection.name}
					</Title>
					<Text
						w={'100%'}
						styles={{ root: { wordBreak: 'break-word' } }}
						mt={'lg'}
					>
						{subSection.description}
					</Text>
					<Title order={2} mt={'lg'}>
						Notes
					</Title>
					<Grid mt={'lg'}>
						{notes?.map((note, i) => {
							const noteTags = tags.filter((tag) =>
								tag.notes.some((n) => n._id === note._id)
							);
							return (
								<Grid.Col span={{ base: 12, md: 6 }} key={i}>
									<ViewNoteDetailsDialog
										noteContent={note.content}
										noteId={note._id}
										noteSources={note.sources}
										noteTags={noteTags}
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
						subSectionId={subSection._id}
						opened={createNoteModalOpened}
						close={createNoteModalHandler.close}
					></CreateNoteModal>
					<ConfirmationPopup
						actionComponent={<Button>Delete Subsection</Button>}
						title="Delete Subsection"
						message={deleteSubsectionMessage}
						onConfirm={() =>
							handleDeleteOneSubSection(
								subSections,
								setSubSections,
								subSection._id,
								deleteSubSectionMutation
							)
						}
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 'content' }} visibleFrom="md">
					<Divider w="100%" h="100%" orientation="vertical" />
				</Grid.Col>
				<Grid.Col span={{ base: 'auto' }} visibleFrom="md">
					{/* <Filter setNotes={setNotes}  containerNotes={allProjectNotes.filter((note)=>{return note.subSection == subSection._id })}></Filter> */}
					<Filter setNotes={setNotes} containerNotes={subSectionNotes}></Filter>
				</Grid.Col>
			</Grid>
		</motion.div>
	);
};

export default SubSectionDetails;
