import { LoadingOverlay } from '@mantine/core';
import { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { AppDataContext } from '../../context/AppDataContext';
import { useAuth } from '../../customHooks/useAuth';
import {
	fetchAllNotesForProject,
	fetchProjectById,
	fetchSubSectionsPerProjectId,
	fetchTagsPerProjectId,
} from '../../Utils/Queries';

const FetchProjectDetails = () => {
	const {
		project,
		setProject,
		subSections,
		setSubSections,
		tags,
		setTags,
		allProjectNotes,
		setAllProjectNotes,
	} = useContext(AppDataContext);
	const { projectId } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [queriesFinished, setqueriesFinished] = useState(false);
	const [projectFetched, setProjectFetched] = useState(false);
	const initialRenderForSubSectionUseEffect = useRef(true);
	const initialRenderForAllProjectNotesUseEffect = useRef(true);

	const fetchProjectAndSubSections = async (projectId) => {
		const [project, subsections] = await Promise.all([
			fetchProjectById(projectId),
			fetchSubSectionsPerProjectId(projectId),
		]);
		return { project, subsections };
	};
	useEffect(() => {
		setqueriesFinished(false);
		const fetchProjectAndSubSectionsInUseEffect = async (projectId) => {
			const data = await fetchProjectAndSubSections(projectId);
			return data;
		};
		//todo add error handling here
		if (projectId === undefined || projectId === null)
			return navigate('/UserHome');
		fetchProjectAndSubSectionsInUseEffect(projectId)
			.then((data) => {
				if (!data.project.project) return navigate('/UserHome');
				setProject(data.project.project);
				setSubSections(data.subsections);
			})
			.catch((error) => {
				return navigate('/UserHome');
			});
	}, [projectId]);

	/*
        If the following useEffect is not present, sometimes there is an error when trying to access the projectDetails page 
        because the setqueriesFinished(true) sometimes gets called before the setProject(data.project.project) in the above useEffect
        (its not that it gets called before, its that the setProject(data.project.project) in the above useEffect sometimes does not 
        get changed before the setqueriesFinished(true) gets called)
    */
	useEffect(() => {
		if (!project) {
			setProjectFetched(false);
		} else {
			setProjectFetched(true);
		}
	}, [project]);

	useEffect(() => {
		if (projectId === undefined || projectId === null) {
			console.log('projectId is undefined or null. returning');
			return navigate('/UserHome');
		}
		if (initialRenderForSubSectionUseEffect.current) {
			initialRenderForSubSectionUseEffect.current = false;
			return;
		}
		setqueriesFinished(false); //todo might need to remove
		fetchAllNotesForProject(
			projectId,
			subSections.map((x) => {
				return x._id;
			})
		)
			.then((data) => {
				setAllProjectNotes(data);
			})
			.catch((error) => {
				return navigate('/UserHome');
			});
	}, [subSections]);

	useEffect(() => {
		if (projectId === undefined || projectId === null) {
			return navigate('/UserHome');
		}
		if (initialRenderForAllProjectNotesUseEffect.current) {
			initialRenderForAllProjectNotesUseEffect.current = false;
			return;
		}
		setqueriesFinished(false);
		fetchTagsPerProjectId(projectId)
			.then((data) => {
				setTags(data.tags);
				setqueriesFinished(true);
			})
			.catch((error) => {
				return navigate('/UserHome');
			});
	}, [allProjectNotes]);

	if (!queriesFinished || !projectFetched) {
		return (
			<LoadingOverlay
				visible={true}
				zIndex={1000}
				overlayProps={{ radius: 'sm', blur: 2 }}
			/>
		);
	}
	return <Outlet />;
};

export default FetchProjectDetails;
