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
  Center
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjectPerUserId } from '../../Utils/Queries';
import { useAuth } from '../../customHooks/useAuth';
import { CreateProjectModal } from '../assets/CreateProjectModal';
import { ErrorPage } from './ErrorPage';

const UserHomePage = () => {
	const breadcrumbs = [{ title: 'Home', href: '/UserHome' }].map(
		(item, index) => (
			<Link to={item.href} key={index}>
				{item.title}
			</Link>
		)
	);

	const { user } = useAuth(); //do not remove
	const [createProjectModalOpened, createProjectModalHandler] = useDisclosure(false);

	const navigate = useNavigate();
	const [projects, setProjects] = useState([]);
	const { isLoading, error, data, isFetching } = useQuery(
		'projects',
		() => fetchProjectPerUserId(),
		{
			onSuccess: (data) => {
				setProjects(data.project);
			}
		}
	);
	const handleClick = (projectId) => {
		navigate(`/ProjectDetails/${projectId}`);
	};
	if (error) return <ErrorPage></ErrorPage>;
	if (isFetching) return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;
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
      {projects.length > 0 ? 
      <>
        <Grid>
          {projects.map((project, i) => {
            const projectLink = `/ProjectDetails/${project._id}`;
            return (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i}  >
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  component={Link}
                  to={projectLink}
                  h="100%"
                  w="100%"
                  c="gray"
                >
                  <Group>
                    <Text truncate="end" fw={500}>
                      {project.projectName}
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
                      {project.description || 'No description'}
                    </Text>
                  </Box>
                </Card>
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
          <Button onClick={(e)=>{createProjectModalHandler.open()}}>Create Project</Button>
          <CreateProjectModal projects={projects} setProjects={setProjects} opened={createProjectModalOpened} close={createProjectModalHandler.close}   ></CreateProjectModal>
        </Flex>
      </>
      : <>
          <Grid>
            <Grid.Col span={{base: 12, md: 6}} >
              <Text size='xl'>You have no projects. Create one!</Text>
              <Flex
                mt={50}
                mih={50}
                gap="md"
                align="flex-start"
                direction="row"
                wrap="wrap"
              >
                <Button onClick={(e)=>{createProjectModalHandler.open()}}>Create Project</Button>
                <CreateProjectModal projects={projects} setProjects={setProjects} opened={createProjectModalOpened} close={createProjectModalHandler.close}   ></CreateProjectModal>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 6}} >
              <Box w='20rem' h='20rem' visibleFrom="sm">
                <Center maw='100%' h='100%'>
                  <Image
                    radius="md"
                    src="/UserHomePageNoProjects.svg"
                    
                  />
                </Center>
              </Box>
            </Grid.Col>
          </Grid>
          
          {/* <Flex
            mih={50}
            gap="md"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            <Button onClick={(e)=>{createProjectModalHandler.open()}}>Create Project</Button>
            <CreateProjectModal2 projects={projects} setProjects={setProjects} opened={createProjectModalOpened} close={createProjectModalHandler.close}   ></CreateProjectModal2>
          </Flex> */}
        </>}
			{/*<br/>
      this page will only be accessible once user logs in.
      <br/>
      This page will contain all the projects 
      <br/>
      create a project:
      <Button onClick={(e)=>{createProjectModalHandler.open()}}>Create Project</Button>
      <CreateProjectModal2 projects={projects} setProjects={setProjects} opened={createProjectModalOpened} close={createProjectModalHandler.close}   ></CreateProjectModal2>
      <br/>
       join a project:
      <JoinProjectModal projects={projects} setProjects={setProjects}></JoinProjectModal>
      <br/>
      your projects:
      {projects.map((project,i) => {
        return (
          <div key={i}>
            <button onClick={() => handleClick(project._id)} >{project.projectName}</button>
          </div>
        )
      })} */}
		</motion.div>
	);
};

export default UserHomePage;
