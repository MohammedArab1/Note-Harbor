import { Box, Card, Divider, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export const SubSectionCard = ({ projectId, subsection }) => {
	return (
		<Card
			shadow="sm"
			padding="lg"
			radius="md"
			withBorder
			component={Link}
			to={`/ProjectDetails/${projectId}/SubSectionDetails/${subsection._id}`}
			h="100%"
			w="100%"
			c="gray"
		>
			<Group>
				<Text truncate="end" fw={500}>
					{subsection.name}
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
					{subsection.description || 'No description'}
				</Text>
			</Box>
		</Card>
	);
};
