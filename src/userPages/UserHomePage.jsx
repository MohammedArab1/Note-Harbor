import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	Center,
	Divider,
	Flex,
	Grid,
	Group,
	Image,
	LoadingOverlay,
	Text,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjectPerUserId } from '../../Utils/Queries';
import { useAuth } from '../../customHooks/useAuth';
import { CreateProjectModal } from '../Components/CreateProjectModal';
import { ErrorPage } from './ErrorPage';
import { ProjectCard } from '../Components/ProjectCard';


const UserHomePage = () => {
	const breadcrumbs = [{ title: 'Home', href: '/UserHome' }].map(
		(item, index) => (
			<Link to={item.href} key={index}>
				{item.title}
			</Link>
		)
	);

	const { user } = useAuth(); //do not remove
	const [createProjectModalOpened, createProjectModalHandler] =
		useDisclosure(false);

	const navigate = useNavigate();
	const [projects, setProjects] = useState([]);
	const { isLoading, error, data, isFetching } = useQuery(
		'projects',
		() => fetchProjectPerUserId(),
		{
			onSuccess: (data) => {
				setProjects(data);
			},
		}
	);
	if (error) return <ErrorPage></ErrorPage>;
	if (isFetching)
		return (
			<LoadingOverlay
				visible={true}
				zIndex={1000}
				overlayProps={{ radius: 'sm', blur: 2 }}
			/>
		);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Breadcrumbs>{breadcrumbs}</Breadcrumbs>
			<Flex
				mt={50}
				mih={50}
				gap="md"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<Title order={1}>Projects</Title>
			</Flex>
			{projects?.length > 0 ? (
				<>
					<Grid>
						{projects.map((project, i) => {
							return (
								<Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i}>
									<ProjectCard project={project}> </ProjectCard>
								</Grid.Col>
							);
						})}
					</Grid>
					<Flex
						mt={50}
						mih={50}
						gap="md"
						align="flex-start"
						direction="row"
						wrap="wrap"
					>
						<Button
							onClick={(e) => {
								createProjectModalHandler.open();
							}}
						>
							Create Project
						</Button>
						<CreateProjectModal
							projects={projects}
							setProjects={setProjects}
							opened={createProjectModalOpened}
							close={createProjectModalHandler.close}
						></CreateProjectModal>
					</Flex>
				</>
			) : (
				<>
					<Grid>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Text size="xl">You have no projects. Create one!</Text>
							<Flex
								mt={50}
								mih={50}
								gap="md"
								align="flex-start"
								direction="row"
								wrap="wrap"
							>
								<Button
									onClick={(e) => {
										createProjectModalHandler.open();
									}}
								>
									Create Project
								</Button>
								<CreateProjectModal
									projects={projects}
									setProjects={setProjects}
									opened={createProjectModalOpened}
									close={createProjectModalHandler.close}
								></CreateProjectModal>
							</Flex>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Box w="20rem" h="20rem" visibleFrom="sm">
								<Center maw="100%" h="100%">
									<Image radius="md" src="/UserHomePageNoProjects.svg" />
								</Center>
							</Box>
						</Grid.Col>
					</Grid>
				</>
			)}
		</motion.div>
	);
};

export default UserHomePage;
