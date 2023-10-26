import { useContext, useState, useEffect } from 'react';
import { useParams, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../customHooks/useAuth';
import { fetchProjectById, fetchSubSectionsPerProjectId, fetchTagsPerProjectId, fetchAllNotesForProject } from '../../Utils/Queries';
import { AppDataContext } from '../../context/AppDataContext';

const FetchProjectDetails = () => {
	const { project, setProject, subSections,setSubSections, tags, setTags, allProjectNotes, setAllProjectNotes } = useContext(AppDataContext);
	const { projectId } = useParams();
    const {user} = useAuth()
    const navigate = useNavigate()
    const [queriesFinished, setqueriesFinished] = useState(false)

    const fetchProjectAndSubSections = async (projectId) => {
        const [project, subsections, tags] = await Promise.all([
            fetchProjectById(projectId),
            fetchSubSectionsPerProjectId(projectId),
            fetchTagsPerProjectId(projectId),
        ]);
        return { project, subsections, tags };
    };
    useEffect(() => {
        setqueriesFinished(false)
        const fetchProjectAndSubSectionsInUseEffect = async (projectId) => {
            const data = await fetchProjectAndSubSections(projectId)
            return data
        }
        //todo add error handling here
        if (projectId === undefined || projectId === null) return
        fetchProjectAndSubSectionsInUseEffect(projectId).then((data) => {
            setProject(data.project.project);
            setSubSections(data.subsections);
            setTags(data.tags.tags);
            fetchAllNotesForProject(projectId,data.subsections.map((x) => {return x._id;})).then((data) => {
                setAllProjectNotes(data)
                setqueriesFinished(true)
            })
        }).catch((error) => {
            return navigate("/UserHome")
        })
    },[projectId])
    
    if(!queriesFinished) return <p>Loading...</p>
    return (
        <Outlet/> 
    )
};

export default FetchProjectDetails;
