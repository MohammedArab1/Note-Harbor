// import { Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AppDataContext } from '../../context/AppDataContext';
import { useAuth } from '../../customHooks/useAuth';
import { useMutations } from '../../customHooks/useMutations';
import { CreateNoteModal } from '../assets/CreateNoteModal';
import ViewNoteDetailsDialog from '../assets/ViewNoteDetailsDialog';
import NoteDetailsCard from '../assets/NoteDetailsCard';
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
    ActionIcon
  } from '@mantine/core';
  import {IconArrowBarLeft} from '@tabler/icons-react';
  import { format } from "date-fns"
  import {motion} from "framer-motion"
  import { useDisclosure } from "@mantine/hooks";
import ConfirmationPopup from '../assets/ConfirmationPopup';
import { handleDeleteOneSubSection } from '../../Utils/Utils';

const SubSectionDetails = () => {
    const [createNoteModalOpened, createNoteModalHandler] = useDisclosure(false);
	const { allProjectNotes, setAllProjectNotes, subSections, project, tags, setSubSections } =
		useContext(AppDataContext);
	const { invalid, deleteNoteMutation,deleteSubSectionMutation } = useMutations();
	const { user } = useAuth();
	const { subSectionId, projectId } = useParams();
	const navigate = useNavigate();
	const [subSection, setsubSection] = useState({});
	const [notes, setNotes] = useState([]);
	const deleteSubsectionMessage = <Text m={10}>Are you sure you want to delete this Subsection?</Text>
	useEffect(() => {
		if (!subSectionId) {
			return navigate('/UserHome');
		}
	}, []);
	useEffect(() => {
		const specificSubSection = subSections.find((x) => {
			return x._id == subSectionId;
		})
		if (!specificSubSection) {
			return navigate('/UserHome');
		}
		setsubSection(specificSubSection);
		setNotes(
			allProjectNotes.filter((x) => {
				return x.project == null && x.subSection == subSectionId;
			})
		);
	}, [allProjectNotes]);

    const breadcrumbs = [{ title: 'Home', href: '/UserHome' },{title:`${project.projectName}`,href:`/ProjectDetails/${project._id}`}, {title:`${subSection.name}`,href:`/ProjectDetails/${project._id}/SubSectionDetails/${subSection._id}`}].map(
		(item, index) => (
			<Link to={item.href} key={index}>
				{item.title}
			</Link>
		)
	);
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
				<Grid.Col span={{ base: 12 }} mt={'md'}>
					<Title order={1}>{subSection.name}</Title>
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
							const noteTags = tags.filter(tag => tag.notes.some(n => n._id === note._id));
							return (
								<Grid.Col span={{ base: 12, md: 6 }} key={i}>
									<ViewNoteDetailsDialog
										noteContent={note.content}
										noteId={note._id}
										noteSources={note.sources}
										noteTags={noteTags}
										actionComponent={
											<NoteDetailsCard noteDateCreated={note.dateCreated} noteCreatedBy={note.user?.firstName ? (note.user?.firstName + " "+ note.user?.lastName) : ""} noteContent={note.content}>
											</NoteDetailsCard>
										}
									></ViewNoteDetailsDialog>
									{/* <ViewNoteDetailsDialog
										noteContent={note.content}
										noteId={note._id}
										noteSources={note.sources}
										noteTags={noteTags}
										actionComponent={
										<NoteDetailsCard noteDateCreated={note.dateCreated} noteCreatedBy={note.user?.firstName ? (note.user?.firstName + " "+ note.user?.lastName) : ""} noteContent={note.content}>
										</NoteDetailsCard>
										}>
									</ViewNoteDetailsDialog> */}
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
					<ConfirmationPopup actionComponent={<Button>Delete Subsection</Button>} title="Delete Subsection" message={deleteSubsectionMessage} onConfirm={() => handleDeleteOneSubSection(subSections,setSubSections, subSection._id, deleteSubSectionMutation)}/>
				</Grid.Col>
				<Grid.Col span={{ base: 'content' }}>
					<Divider w="100%" h="100%" orientation="vertical" />
				</Grid.Col>
				<Grid.Col span={{ base: 'auto' }}>
					<p>test grid col span 3</p>
				</Grid.Col>
			</Grid>
		</motion.div>

		// <div>
		//     <p>Welcome to subsection detail page.</p>
		//     <p>---------------------------------------------------------------</p>
		//     <h2>Subsection details:</h2>
		//     <p>name: {subSection.name}</p>
		//     <p>description: {subSection.description}</p>
		//     <p>---------------------------------------------------------------</p>
		//     <h2>Notes associated with this subsection:</h2>
		//     {notes.map((note,i) => {
		//         return (
		//         <div key={i}>
		//         <h3>note {i+1}</h3>
		//         <p>note content: {note.content}</p>
		//         <p>note created by: {note?.user?.firstName + " "+ note?.user?.lastName}</p>
		//         <p>note date created: {note.dateCreated}</p>
		//         <p>sources for this note:</p>
		//         <ol>
		//             {
		//             note.sources.map((source,i)=>{
		//                 return(
		//                 <li key={i}>
		//                 <p>source name: {source.source}</p>
		//                 <p>source additional information: {source.additionalSourceInformation}</p>
		//                 </li>
		//                 )
		//             })
		//             }
		//         </ol>
		//         <ViewNoteDetailsDialog name="View Note Details"
		//             noteContent={note.content}
		//             noteId={note._id}
		//             noteCreatedBy={note?.user?.firstName + " "+ note?.user?.lastName}
		//             noteDateCreated={note.dateCreated}
		//             noteSources={note.sources}
		//         />
		//         <Button variant="text" type="button" onClick={() => handleDeleteOneNote(allProjectNotes,setAllProjectNotes,note._id,deleteNoteMutation)}>delete this note</Button>
		//         </div>)
		//     })}
		//     <CreateNoteModal subSectionId={subSection._id}></CreateNoteModal>
		//     <button onClick={() => navigate(`/ProjectDetails/${projectId}`)}>go back</button>
		// </div>
	);
};

export default SubSectionDetails;
