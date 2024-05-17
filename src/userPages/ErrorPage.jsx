import { Box, Button, Center, Flex, Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import errorAnimation from '../../images/Lotties/404Animation.json';

export const ErrorPage = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Flex
				gap="md"
				justify="center"
				align="center"
				direction="row"
				wrap="wrap"
			>
				<Box w="35rem" h="35rem" visibleFrom="sm">
					<Center maw="100%" h="100%">
						<Lottie animationData={errorAnimation} loop={true} />
					</Center>
				</Box>
			</Flex>
			<Center>
				<Title order={1}>Oh no! </Title>
			</Center>
			<Center>
				<Text size="xl">
					Seems like something went wrong. Please try again later.
				</Text>
			</Center>
			<Center>
				<Button mt={20} align="center" component={Link} to="/">
					Home
				</Button>
			</Center>
		</motion.div>
	);
};
