import { Box, Card, Divider, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export const ProjectCard = ({ project }) => {
	const projectLink = `/ProjectDetails/${project._id}`;
	return (
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
	);
};
