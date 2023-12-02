import { Button } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppDataContext } from "../../context/AppDataContext"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { CreateNoteModal } from "../assets/CreateNoteModal"
import { handleDeleteOneNote } from "../../Utils/Utils"
import ViewNoteDetailsDialog from "../assets/ViewNoteDetailsDialog"

const SubSectionDetails = () => {
    const { allProjectNotes, setAllProjectNotes, subSections } = useContext(AppDataContext)
    const {invalid, deleteNoteMutation} = useMutations()
    const {user} = useAuth()
    const {subSectionId, projectId} = useParams()
    const navigate = useNavigate()
    const [subSection, setsubSection] = useState({})
    const [notes, setNotes] = useState([])
    useEffect(() => {
        if(!subSectionId){
            return navigate("/UserHome")
        }
    }, [])
    useEffect(() => {
        setsubSection(subSections.find((x)=>{return x._id===subSectionId}))
        setNotes(allProjectNotes.filter((x)=>{return ((x.project==null)&&(x.subSection===subSectionId))}))
    },[allProjectNotes])

    return (
        <div>
            <p>Welcome to subsection detail page.</p>
            <p>---------------------------------------------------------------</p>
            <h2>Subsection details:</h2>
            <p>name: {subSection.name}</p>
            <p>description: {subSection.description}</p>
            <p>---------------------------------------------------------------</p>
            <h2>Notes associated with this subsection:</h2>
            {notes.map((note,i) => {
                return (
                <div key={i}>
                <h3>note {i+1}</h3>
                <p>note content: {note.content}</p>
                <p>note created by: {note.user.firstName + " "+ note.user.lastName}</p>
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
                    noteCreatedBy={note.user.firstName + " "+ note.user.lastName} 
                    noteDateCreated={note.dateCreated}
                    noteSources={note.sources}
                />
                <Button variant="text" type="button" onClick={() => handleDeleteOneNote(allProjectNotes,setAllProjectNotes,note._id,deleteNoteMutation)}>delete this note</Button>
                </div>)
            })}
            <CreateNoteModal subSectionId={subSection._id}></CreateNoteModal>
            <button onClick={() => navigate(`/ProjectDetails/${projectId}`)}>go back</button>
        </div>
    )

}

export default SubSectionDetails