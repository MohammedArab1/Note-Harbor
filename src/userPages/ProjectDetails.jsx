import { Button } from "@mui/material"
import { useQuery} from "react-query"
import { fetchNotesPerProjectId, fetchProjectById, fetchSubSectionsPerProjectId } from "../../Utils/Queries"
import { useNavigate, useParams } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { useState, useEffect } from "react"
import ConfirmationPopup from "../assets/ConfirmationPopup"
import { CreateSubSectionModal } from "../assets/CreateSubSectionModal"
import { CreateNoteModal } from "../assets/CreateNoteModal"


const ProjectDetails = () => {
  const {deleteProjectMutation,invalid, leaveProjectMutation, deleteNoteMutation} = useMutations()
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

  const handleDeleteOneNote = (noteIdToBeDeleted)=>{
    const newNotes = notes.filter(note => note._id !== noteIdToBeDeleted)
    setNotes(newNotes)
    deleteNoteMutation.mutate([noteIdToBeDeleted])
  }

  const fetchProjectAndSubSections = async (projectId) => {
    const [project, subsections, notes] = await Promise.all(
      [
        fetchProjectById(projectId), 
        fetchSubSectionsPerProjectId(projectId), 
        fetchNotesPerProjectId(projectId)
      ]
    );
    return {project, subsections, notes};
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
        </div>)
      })}
      { isUserLeader(project.leader._id) && <CreateSubSectionModal subSections={subSections} setSubSections={setSubSections} projectId={projectId}></CreateSubSectionModal>}
      { isUserLeader(project.leader._id) && <ConfirmationPopup name="Delete project" message={projectLeaderDeleteMessage} onConfirm={() => deleteProjectMutation.mutate(projectId)}></ConfirmationPopup>}
      <button onClick={() => navigate(-1)}>go back</button>
      <br/>
      { isUserLeader(project.leader._id) ?  
      <ConfirmationPopup name="Leave project" message={projectLeaderLeaveMessage} onConfirm={() => handleLeaveProject(user.id)}></ConfirmationPopup> :
      <Button variant="text" type="button" onClick={() => handleLeaveProject(user.id)}>Leave project</Button> 
      }
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
    </div>
  )
  }

export default ProjectDetails