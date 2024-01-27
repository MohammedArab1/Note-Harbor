import { useNavigate, useParams, Link } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { useState, useEffect, useContext } from "react"
import ConfirmationPopup from "../assets/ConfirmationPopup"
import { CreateSubSectionModal } from "../assets/CreateSubSectionModal"
import { CreateNoteModal } from "../assets/CreateNoteModal"
import { CreateTagModal } from "../assets/CreateTagModal"
import { AppDataContext } from "../../context/AppDataContext"
import ViewNoteDetailsDialog from "../assets/ViewNoteDetailsDialog"
import NoteDetailsCard from "../assets/NoteDetailsCard"
import { isOfflineMode } from "../../Utils/Utils"
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
import { TagsDetailModal} from "../assets/TagsDetailModal"

const ProjectDetails = () => {
  const { tags, setTags, allProjectNotes, setAllProjectNotes, project, setProject, subSections,setSubSections } = useContext(AppDataContext)
  const [uniqueSources, setUniqueSources] = useState([])
  const [createNoteModalOpened, createNoteModalHandler] = useDisclosure(false);
  const [viewTagsModalOpened, viewTagsModalHandler] = useDisclosure(false);
  const [createTagModalOpened, createTagModalHandler] = useDisclosure(false);
  const [createSubsectionModalOpened, createSubsectionModalHandler] = useDisclosure(false);
  const {deleteProjectMutation,invalid, leaveProjectMutation, deleteNoteMutation, deleteSubSectionMutation, deleteTagMutation} = useMutations()
  const {user} = useAuth()
  const {projectId} = useParams()
  const navigate = useNavigate()
  const [notes, setNotes] = useState(null)
  const projectLeaderLeaveMessage = <Text m={10}>Are you sure you want to leave this Project? Since you are the project leader, a random member will be appointed project leader after you leave.</Text>
  const projectLeaderDeleteMessage = <Text m={10}>Are you sure you want to delete this project?</Text>
  const handleLeaveProject = (userToBeDeletedId) => {
    const newProject = {...project, members: project.members.filter(member => member._id !== userToBeDeletedId)}
    if (project.leader._id===userToBeDeletedId) {
      const newLeader = newProject.members[Math.floor(Math.random() * newProject.members.length)];
      newProject.leader = newLeader
    }
    leaveProjectMutation.mutate({projectId:newProject._id,newProject})
  }
  const handleVisitSubSectionDetailPage = (subSection) => {
    navigate(`/ProjectDetails/${projectId}/SubSectionDetails/${subSection._id}`)
  }
  useEffect(() => {
    const allSources = allProjectNotes.reduce((accumulator, note) => {
      return accumulator.concat(note.sources);
    }, []);
    const uniqueSources = allSources.filter((source, index, self) =>
        index === self.findIndex((t) => (
            t.source === source.source
        ))
    );
    setUniqueSources(uniqueSources)
    setNotes(allProjectNotes.filter((x)=>{return x.project!=null}))
  }, [allProjectNotes])

  const breadcrumbs = [{ title: 'Home', href: '/UserHome' },{title:`${project.projectName}`,href:`/ProjectDetails/${project._id}`}].map(
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
      <Button mt='lg' leftSection={<IconArrowBarLeft/>} variant="transparent" component={Link} to='/UserHome' c={'black'}>Go back</Button>
      <Grid columns={17}>
        <Grid.Col span={{base:12}} mt={'md'}>
          <Title order={1}>{project.projectName}</Title>
          <Text w={'100%'} styles={{ root: { wordBreak: 'break-word' } }} mt={"lg"}>{project.description}</Text>
          <Title mt={'lg'} order={2}>SubSections</Title>
            <Grid mt={'lg'}>
              {subSections.length <1  && 
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text>No subsections yet... create one!</Text>
                </Grid.Col>
              }
              {subSections.map((subsection,i) => {
                return (
                  <Grid.Col span={{ base: 12, md: 6 }} key={i}  >
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
                )
              })}
            </Grid>
            <Button mt={10} onClick={(e)=>{createSubsectionModalHandler.open()}}>Create a Subsection</Button>
            <CreateSubSectionModal subSections={subSections} setSubSections={setSubSections} projectId={projectId} opened={createSubsectionModalOpened} close={createSubsectionModalHandler.close}></CreateSubSectionModal>
          <Title order={2} mt={'lg'}>Notes</Title>
          <Grid mt={'lg'}>
            {notes?.map((note,i) => {
              const noteTags = tags.filter(tag => tag.notes.some(n => n._id === note._id));
              return (
              <Grid.Col span={{ base: 12, md: 6 }} key={i}  >
                <ViewNoteDetailsDialog
                    noteContent={note.content}
                    noteId={note._id}
                    noteSources={note.sources}
                    noteTags={noteTags}
                    actionComponent={
                      <NoteDetailsCard noteDateCreated={note.dateCreated} noteCreatedBy={note.user?.firstName ? (note.user?.firstName + " "+ note.user?.lastName) : ""} noteContent={note.content}>
                      </NoteDetailsCard>
                    }>
                </ViewNoteDetailsDialog>
              </Grid.Col>
              )
            })}
          </Grid>
          <Button mt={10} onClick={(e)=>{createNoteModalHandler.open()}}>Add a Note</Button>
          <CreateNoteModal projectId={projectId} opened={createNoteModalOpened} close={createNoteModalHandler.close}></CreateNoteModal>
          <Flex
            mih={20}
            mt={15}
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            
            {/* { (isUserLeader(project?.leader?._id ) || isOfflineMode()) && 
              <ConfirmationPopup title="Delete project" message={projectLeaderDeleteMessage} onConfirm={() => deleteProjectMutation.mutate(projectId)} buttonText="Delete Project"/>
            }
            {!isOfflineMode() && ((isUserLeader(project?.leader?._id )) ?  
              <ConfirmationPopup title="Leave project" message={projectLeaderLeaveMessage} onConfirm={() => handleLeaveProject(user.id)} buttonText="Leave Project"></ConfirmationPopup> :
              <Button variant="text" type="button" onClick={() => handleLeaveProject(user.id)}>Leave project</Button> )
            } */}
            {
              (isUserLeader(project?.leader?._id ) || isOfflineMode()) && 
              <ConfirmationPopup actionComponent={<Button>Delete Project</Button>} title="Delete project" message={projectLeaderDeleteMessage} onConfirm={() => deleteProjectMutation.mutate(projectId)}/>
            }
            {project?.members?.length > 1 && !isOfflineMode() && 
              ((isUserLeader(project?.leader?._id )) ?  
                <ConfirmationPopup actionComponent={<Button>Leave Project</Button>} title="Leave project" message={projectLeaderLeaveMessage} onConfirm={() => handleLeaveProject(user.id)}/> :
                <Button variant="light" type="button" onClick={() => handleLeaveProject(user.id)}>Leave project</Button> )
            }

        </Flex>
        </Grid.Col>
        <Grid.Col span={{base:'content'}} >
          {/* <Center> */}
            <Divider w='100%' h='100%' orientation="vertical" />
          {/* </Center> */}
        </Grid.Col>
        <Grid.Col span={{base:'auto'}} >
          <p>test grid col span 3</p>
          <Flex
            mih={20}
            mt={15}
            gap="md"
            justify="space-between"
            align="flex-start"
            direction="row"
            wrap="wrap"
            
          >
            <TagsDetailModal opened={viewTagsModalOpened} close={viewTagsModalHandler.close}></TagsDetailModal>
            <CreateTagModal tags={tags} setTags={setTags} projectId={projectId} opened={createTagModalOpened} close={createTagModalHandler.close}/>
            <Button variant="light" onClick={()=>createTagModalHandler.open()}>Create a Tag</Button>
            <Button onClick={()=>viewTagsModalHandler.open()}>View Tags</Button>
          </Flex>
        </Grid.Col>
      </Grid>









      {/* {invalid.isInvalid && <p>{invalid.message}</p>}
      <p>Project name: {project.projectName}</p>
      {project.description && <p>Project description: {project.description}</p>}
      <p>Access Code: {project.accessCode}</p>
      <p>project id: {project._id}</p>
      <p>---------------------------------------------------------------</p>
      <h2>OTHER MEMBERS:</h2>
      {project?.members?.filter(member => member._id !== user.id).map((member,i) => {
        return (
          <div key={i}>
            <h3>member {i+1}</h3>
            <p>Member name: {member.firstName} {member.lastName}</p>
            <p>Member email: {member.email}</p>
            <p>Member id: {member._id}</p>
            {isUserLeader(project.leader._id) && <Button variant="text" type="button" onClick={() => handleLeaveProject(member._id)}>Kick user from project</Button>}
          </div>
        )})}
      <p>---------------------------------------------------------------</p>
      <h2>Me:</h2>
      <p>My name: {user?.firstName} {user?.lastName}</p>
      <p>My email: {user?.email}</p>
      <p>My id: {user?.id}</p>
      <p>---------------------------------------------------------------</p>
      <h2>SubSections:</h2>
      {subSections.map((subsection,i) => {
        return (
          <div key={i}>
            <h3>subsection {i+1}</h3>
            <p>subsection name: {subsection.name}</p>
            <p>subsection description: {subsection.description}</p>
            <Button variant="text" type="button" onClick={() => handleVisitSubSectionDetailPage(subsection)}>go to subSection detail page</Button>
            <ConfirmationPopup 
              name="Delete SubSection" 
              message={"Are you sure you want to delete subsection? All notes associated with this subsection will be deleted"}
              onConfirm={() => {
                handleDeleteOneSubSection(subSections,setSubSections, subsection._id, deleteSubSectionMutation)
              }}>
            </ConfirmationPopup>
          </div>)
        })}
      { (isUserLeader(project?.leader?._id ) || isOfflineMode()) && <CreateSubSectionModal subSections={subSections} setSubSections={setSubSections} projectId={projectId}></CreateSubSectionModal>}
      <p>---------------------------------------------------------------</p>
      <h2>All Application Notes:</h2>
      {allProjectNotes?.map((note,i) => {
        return (
        <div key={i}>
          <h3>note {i+1}</h3>
          <p>note id: {note._id}</p>
          <p>note content: {note.content}</p>
          <p>note created by: {note.user?.firstName + " "+ note.user?.lastName}</p>
          <p>note date created: {note.dateCreated}</p>
          <p>sources for this note:</p>
          
          <ol>
            {
              note.sources.map((source,i)=>{
                return(
                <li key={i}>
                  <p>source name: {source.source}</p>
                  <p>source additional information: {source.additionalSourceInformation}</p>
                </li>
                )
              })
            }
          </ol>
          <ViewNoteDetailsDialog name="View Note Details" 
            noteContent={note.content}
            noteId={note._id}
            noteCreatedBy={note.user?.firstName + " "+ note.user?.lastName} 
            noteDateCreated={note.dateCreated}
            noteSources={note.sources}
          />
          <br />
          <Button variant="text" type="button" onClick={() => handleDeleteOneNote(allProjectNotes,setAllProjectNotes,note._id,deleteNoteMutation)}>delete this note</Button>
        </div>)
      })}
      <CreateNoteModal projectId={projectId}></CreateNoteModal>
      <p>---------------------------------------------------------------</p>
      <h2>Notes associated only with this project (not with any subsection)</h2>
      {notes?.map((note,i) => {
        return (
        <div key={i}>
          <h3>note {i+1}</h3>
          <p>note content: {note.content}</p>
          <p>note created by: {note.user?.firstName + " "+ note.user?.lastName}</p>
          <p>note date created: {note.dateCreated}</p>
          <p>sources for this note:</p>
          <ol>
            {
              note.sources.map((source,i)=>{
                return(
                <li key={i}>
                  <p>source name: {source.source}</p>
                  <p>source additional information: {source.additionalSourceInformation}</p>
                </li>
                )
              })
            }
          </ol>
          <Button variant="text" type="button" onClick={() => handleDeleteOneNote(allProjectNotes,setAllProjectNotes,note._id,deleteNoteMutation)}>delete this note</Button>
        </div>)
      })}
      <CreateNoteModal projectId={projectId}></CreateNoteModal>
      <p>---------------------------------------------------------------</p>
      <h2>Tags:</h2>
      {tags.map((tag,i) => {
        return (
        <div key={i}>
          <h3>tag {i+1}</h3>
          <p>tag name: {tag.tagName}</p>
          <p>tag id: {tag._id}</p>
          <p>tag colour: {<CircleIcon style={{ color: tag.colour }} fontSize='large'/>}</p>
          <p>notes associated with this tag: </p>
          <ol>
            {
              tag.notes.map((note,i)=>{
                return (<li key={i}>
                  {note}
                </li>)
              })
            }
          </ol>
          <ConfirmationPopup 
              name="Delete tag" 
              message={"Are you sure you want to delete this tag? Notes will no longer be tagged with this tag"}
              onConfirm={() => handleDeleteOneTag(tags,setTags,tag._id, deleteTagMutation)}>
            </ConfirmationPopup>
        </div>)
      })}
      <CreateTagModal tags={tags} setTags={setTags} projectId={projectId}/>
      <p>---------------------------------------------------------------</p>
      <h2>Unique Sources:</h2>
      {
        uniqueSources.map((source,i) => {
          return (
          <div key={i}>
            <h3>source {i+1}</h3>
            <p>source name: {source.source}</p>
          </div>)
      })}
      <p>---------------------------------------------------------------</p>
      { (isUserLeader(project?.leader?._id ) || isOfflineMode()) && <ConfirmationPopup name="Delete project" message={projectLeaderDeleteMessage} onConfirm={() => deleteProjectMutation.mutate(projectId)}></ConfirmationPopup>}
      <button onClick={() => navigate(`/UserHome`)}>go back</button>
      <br/>
      { !isOfflineMode() &&
        ((isUserLeader(project?.leader?._id )) ?  
        <ConfirmationPopup name="Leave project" message={projectLeaderLeaveMessage} onConfirm={() => handleLeaveProject(user.id)}></ConfirmationPopup> :
        <Button variant="text" type="button" onClick={() => handleLeaveProject(user.id)}>Leave project</Button> )
      }*/}









    </motion.div> 
  )
  }

export default ProjectDetails