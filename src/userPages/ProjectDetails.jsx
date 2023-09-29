import { Button } from "@mui/material"
import { useQuery} from "react-query"
import { fetchNotesPerProjectId, fetchProjectById, fetchSubSectionsPerProjectId, fetchTagsPerProjectId, fetchUniqueSourcesPerProjectId } from "../../Utils/Queries"
import { useNavigate, useParams } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { useState, useEffect, useContext } from "react"
import ConfirmationPopup from "../assets/ConfirmationPopup"
import { CreateSubSectionModal } from "../assets/CreateSubSectionModal"
import { CreateNoteModal } from "../assets/CreateNoteModal"
import { CreateTagModal } from "../assets/CreateTagModal"
import CircleIcon from '@mui/icons-material/Circle';
import { AppDataContext } from "../../context/AppDataContext"
import { CreateSourceModal } from "../assets/CreateSourceModal"


const ProjectDetails = () => {
  const { tags, setTags, sources, setSources } = useContext(AppDataContext)
  const {deleteProjectMutation,invalid, leaveProjectMutation, deleteNoteMutation, deleteSubSectionMutation, deleteTagMutation, deleteUniqueSourceMutation} = useMutations()
  const {user} = useAuth()
  const {projectId} = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [subSections, setSubSections] = useState([])
  const [notes, setNotes] = useState([])
  const projectLeaderLeaveMessage = "Are you sure you want to leave this Project? Since you are the project leader, a random member will be appointed project leader after you leave."
  const projectLeaderDeleteMessage = "Are you sure you want to delete this project?"

  const handleLeaveProject = (userToBeDeletedId) => {
    const newProject = {...project, members: project.members.filter(member => member._id !== userToBeDeletedId)}
    if (project.leader._id===userToBeDeletedId) {
      const newLeader = newProject.members[Math.floor(Math.random() * newProject.members.length)];
      newProject.leader = newLeader
    }
    leaveProjectMutation.mutate({projectId:newProject._id,newProject})
  }

  const handleVisitSubSectionDetailPage = (subSection) => {
    navigate(`/ProjectDetails/${projectId}/SubSectionDetails`, {state: {subSection}})
  }

  const handleDeleteOneNote = (noteIdToBeDeleted)=>{
    const newNotes = notes.filter(note => note._id !== noteIdToBeDeleted)
    //todo you're going to need to do some sort of error catching here in case the mutation fails, you don't updates the notes state. (pretty sure tehre's an onSuccess for mutations)
    //not sure you need to setNotes anymore since you're now just refreshing the page.
    setNotes(newNotes)
    navigate(0)
    deleteNoteMutation.mutate([noteIdToBeDeleted])
  }

  const handleDeleteOneSubSection = (subSectionIdToBeDeleted) => {
    const newSubSections = subSections.filter(subSection => subSection._id !== subSectionIdToBeDeleted)
    //todo you're going to need to do some sort of error catching here in case the mutation fails, you don't updates the notes state. 
    //(pretty sure tehre's an onSuccess for mutations) (there is, check useMutations.js)
    setSubSections(newSubSections)
    deleteSubSectionMutation.mutate(subSectionIdToBeDeleted)
  }

  const handleDeleteOneTag = (tagIdToBeDeleted) => {
    const newTags = tags.filter(tag => tag._id !== tagIdToBeDeleted)
    //todo you're going to need to do some sort of error catching here in case the mutation fails, you don't updates the notes state. 
    //(pretty sure tehre's an onSuccess for mutations) (there is, check useMutations.js)
    setTags(newTags)
    deleteTagMutation.mutate(tagIdToBeDeleted)
  }

  const handleDeleteUniqueSource = (projectId,source) => {
    const newSources = sources.filter(sourceItem => sourceItem !== source)
    //todo you're going to need to do some sort of error catching here in case the mutation fails, you don't updates the notes state. 
    //(pretty sure tehre's an onSuccess for mutations) (there is, check useMutations.js)
    setSources(newSources)
    deleteUniqueSourceMutation.mutate({projectId, source})
  }

  const fetchProjectAndSubSections = async (projectId) => {
    const [project, subsections, notes, tags, sources] = await Promise.all(
      [
        fetchProjectById(projectId), 
        fetchSubSectionsPerProjectId(projectId), 
        fetchNotesPerProjectId(projectId),
        fetchTagsPerProjectId(projectId),
        fetchUniqueSourcesPerProjectId(projectId)
      ]
    );
    return {project, subsections, notes, tags, sources};
  };
  const {error,data, isFetching} = useQuery('projects',() => fetchProjectAndSubSections(projectId),{
    onSuccess: (data) => {
      if (data.project.project===null) {
        return navigate('/UserHome')
      }
      const members = data.project.project.members
      const userExists = members.some(member => member._id === user.id)
      if (!userExists) {
        return navigate('/UserHome')
      }
      setProject(data.project.project)
      setSubSections(data.subsections)
      setNotes(data.notes)
      setTags(data.tags.tags)
      setSources(data.sources.uniqueSources)
    },
    onError: (error) => {
      navigate('/UserHome')
    },
    retry: false,
    // refetchOnReconnect: 'always'
  })

  if (error) return <p>error</p>
  if (isFetching) return <p>fetching...</p>
  return (
    <div>
      {invalid.isInvalid && <p>{invalid.message}</p>}
      <p>Project name: {project.projectName}</p>
      {project.description && <p>Project description: {project.description}</p>}
      <p>Access Code: {project.accessCode}</p>
      <p>project id: {project._id}</p>
      <p>---------------------------------------------------------------</p>
      <h2>OTHER MEMBERS:</h2>
      {project.members.filter(member => member._id !== user.id).map((member,i) => {
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
      <p>My name: {user.firstName} {user.lastName}</p>
      <p>My email: {user.email}</p>
      <p>My id: {user.id}</p>
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
              onConfirm={() => handleDeleteOneSubSection(subsection._id)}>
            </ConfirmationPopup>
          </div>)
        })}
      { isUserLeader(project.leader._id) && <CreateSubSectionModal subSections={subSections} setSubSections={setSubSections} projectId={projectId}></CreateSubSectionModal>}
      <p>---------------------------------------------------------------</p>
      <h2>Notes:</h2>
      {notes.map((note,i) => {
        return (
        <div key={i}>
          <h3>note {i+1}</h3>
          <p>note content: {note.content}</p>
          <p>note created by: {note.user.firstName + " "+ note.user.lastName}</p>
          <p>note date created: {note.dateCreated}</p>
          <Button variant="text" type="button" onClick={() => handleDeleteOneNote(note._id)}>delete this note</Button>
        </div>)
      })}
      <CreateNoteModal notes={notes} setNotes={setNotes} projectId={projectId}></CreateNoteModal>
      <p>---------------------------------------------------------------</p>
      <h2>Tags:</h2>
      {tags.map((tag,i) => {
        return (
        <div key={i}>
          <h3>tag {i+1}</h3>
          <p>tag name: {tag.tagName}</p>
          <p>tag id: {tag._id}</p>
          <p>tag colour: {<CircleIcon style={{ color: tag.colour }} fontSize='large'/>}</p>
          <ConfirmationPopup 
              name="Delete tag" 
              message={"Are you sure you want to delete this tag? Notes will no longer be tagged with this tag"}
              onConfirm={() => handleDeleteOneTag(tag._id)}>
            </ConfirmationPopup>
        </div>)
      })}
      <CreateTagModal tags={tags} setTags={setTags} projectId={projectId}/>
      <p>---------------------------------------------------------------</p>
      <h2>Unique Sources:</h2>
      {
        sources.map((source,i) => {
          return (
          <div key={i}>
            <h3>source {i+1}</h3>
            <p>source name: {source}</p>
            <ConfirmationPopup 
              name="Delete source" 
              message={"Are you sure you want to delete this source? Notes will no longer be sourced with this source"}
              onConfirm={() => handleDeleteUniqueSource(projectId,source)}>
            </ConfirmationPopup>
          </div>)
      })}
      <CreateSourceModal sources={sources} setSources={setSources} projectId={projectId}/>
      <p>---------------------------------------------------------------</p>
      { isUserLeader(project.leader._id) && <ConfirmationPopup name="Delete project" message={projectLeaderDeleteMessage} onConfirm={() => deleteProjectMutation.mutate(projectId)}></ConfirmationPopup>}
      <button onClick={() => navigate(-1)}>go back</button>
      <br/>
      { isUserLeader(project.leader._id) ?  
      <ConfirmationPopup name="Leave project" message={projectLeaderLeaveMessage} onConfirm={() => handleLeaveProject(user.id)}></ConfirmationPopup> :
      <Button variant="text" type="button" onClick={() => handleLeaveProject(user.id)}>Leave project</Button> 
      }
    </div>
  )
  }

export default ProjectDetails