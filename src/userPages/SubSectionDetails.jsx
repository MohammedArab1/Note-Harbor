import { Button } from "@mui/material"
import { useQuery} from "react-query"
import { fetchNotesPerProjectId, fetchProjectById, fetchSubSectionsPerProjectId, fetchNotesPerSubSectionId } from "../../Utils/Queries"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { useState, useEffect, useContext } from "react"
import ConfirmationPopup from "../assets/ConfirmationPopup"
import { CreateSubSectionModal } from "../assets/CreateSubSectionModal"
import { CreateNoteModal } from "../assets/CreateNoteModal"
import { AppDataContext } from "../../context/AppDataContext"


const SubSectionDetails = () => {
    const { allProjectNotes } = useContext(AppDataContext)
    const {invalid, deleteNoteMutation} = useMutations()
    const {user} = useAuth()
    const {state} = useLocation();
    const navigate = useNavigate()
    const [notes, setNotes] = useState([])
    //todo have to find a way to make it so that if you just access the subsection details page (without going through /userhome or projectdetails page first)
    //todo it still works, in the sense that certain objects (for example all application sources) are still fetched. Currently, the page will load but important thinss
    //todo won't be fetched because the useQuery is in the projectDetails page. I'm sure theres a way to make it so that when one of either pages is reached, the fetch occurs.
    useEffect(() => {
        if(state == null){
            navigate(-1)
        }
    }, [])
    const fetchNotesbySubsectionId = async (subSectionId) => {
        const [ notes] = await Promise.all(
            [
                fetchNotesPerSubSectionId(subSectionId)
            ]
        );
            return {notes};
        };

    const handleDeleteOneNote = (noteIdToBeDeleted)=>{
        const newNotes = notes.filter(note => note._id !== noteIdToBeDeleted)
        //todo you're going to need to do some sort of error catching here in case the mutation fails, you don't updates the notes state.
        setNotes(newNotes)
        deleteNoteMutation.mutate([noteIdToBeDeleted])
    }

    const {error,data, isFetching} = useQuery('projects',() => fetchNotesbySubsectionId(state.subSection._id),{
        onSuccess: (data) => {
            setNotes(data.notes)
            // if (data.project.project===null) {
            //     return navigate('/UserHome')
            // }
            // const members = data.project.project.members
            // const userExists = members.some(member => member._id === user.id)
            // if (!userExists) {
            //     return navigate('/UserHome')
            // }
            // setProject(data.project.project)
            // setSubSections(data.subsections)
            // setNotes(data.notes)
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
            <p>Welcome to subsection detail page.</p>
            <p>---------------------------------------------------------------</p>
            <h2>Subsection details:</h2>
            <p>name: {state.subSection.name}</p>
            <p>description: {state.subSection.description}</p>
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
                <Button variant="text" type="button" onClick={() => handleDeleteOneNote(note._id)}>delete this note</Button>
                </div>)
            })}
            <CreateNoteModal notes={notes} setNotes={setNotes} subSectionId={state.subSection._id}></CreateNoteModal>
            <button onClick={() => navigate(-1)}>go back</button>
        </div>
    )

}

export default SubSectionDetails