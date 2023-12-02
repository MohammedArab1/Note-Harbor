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
    const [projectFetched, setProjectFetched] = useState(false)

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
        if (projectId === undefined || projectId === null) return navigate("/UserHome")
        fetchProjectAndSubSectionsInUseEffect(projectId).then((data) => {
            setProject(data.project.project);
            setSubSections(data.subsections);
            setTags(data.tags.tags);
        }).catch((error) => {
            return navigate("/UserHome")
        })
    },[projectId])

    /*
        If the following useEffect is not present, sometimes there is an error when trying to access the projectDetails page 
        because the setqueriesFinished(true) sometimes gets called before the setProject(data.project.project) in the above useEffect
        (its not that it gets called before, its that the setProject(data.project.project) in the above useEffect sometimes does not 
        get changed before the setqueriesFinished(true) gets called)
    */
    useEffect(() => {
        if (!project) {
            setProjectFetched(false)
        }
        else {
            setProjectFetched(true)
        }
    }, [project])
    

    useEffect(() => {
        if (projectId === undefined || projectId === null) return navigate("/UserHome")
        setqueriesFinished(false)
        fetchAllNotesForProject(projectId,subSections.map((x) => {return x._id;})).then((data) => {
            setAllProjectNotes(data)
            setqueriesFinished(true)
        }).catch((error) => {
            return navigate("/UserHome")
        })
    }, [subSections])

    useEffect(() => {
        if (projectId === undefined || projectId === null) return navigate("/UserHome")
        setqueriesFinished(false)
        fetchTagsPerProjectId(projectId).then((data) => {
            setTags(data.tags)
            setqueriesFinished(true)
        }).catch((error) => {
            return navigate("/UserHome")
        })
    }, [allProjectNotes])
    
    
    if(!queriesFinished || !projectFetched){
        return <p>Loading...</p>
    }
    return (
        <Outlet/> 
    )
};

export default FetchProjectDetails;
