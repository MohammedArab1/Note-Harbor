import {
	Anchor,
	AspectRatio,
	Box,
	Button,
	Card,
	Center,
	Divider,
	Flex,
	Image,
	Text,
	Title,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../customHooks/useAuth';
import ConfirmationPopup from './Components/ConfirmationPopup';
import { LoginButton } from './Components/LoginButton';
import { RegisterButton } from './Components/RegisterButton';

const Main = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const onOfflineButtonClick = () => {
		const offlineMode = localStorage.getItem('offlineMode');
		const isOfflineMode = offlineMode === 'true';
		if (!isOfflineMode) {
			logout();
			localStorage.setItem('offlineMode', !isOfflineMode);
			navigate('/userHome');
		} else {
			navigate('/userHome');
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<Flex
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<Title ff="Libre Baskerville" fw={400} order={1}>
					Note Harbor
				</Title>
			</Flex>
			<Flex
				mt="5rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<Title fw={400} order={2} ta="center">
					A place to store your research notes
				</Title>
			</Flex>
			<Flex
				mt="1rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				{!user ? (
					<>
						<LoginButton w={125} />
						<RegisterButton w={125} />
					</>
				) : (
					<Button
						w={125}
						onClick={(e) => {
							navigate('/UserHome');
						}}
					>
						Home
					</Button>
				)}
			</Flex>
			<Flex
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<ConfirmationPopup
					actionComponent={<Button w={125}>Offline</Button>}
					title="Notes on Offline Mode"
					buttonText="Offline"
					message={
						<>
							<ul>
								<li>
									Offline mode is browser based. You cannot sync your data
									between browsers.
								</li>
								<br />
								<li>
									We cannot guarantee that your notes will be stored for an
									indefinite period of time.
								</li>
							</ul>
						</>
					}
					onConfirm={() => onOfflineButtonClick()}
				/>
			</Flex>
			<Flex
				mt="5rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<Box w="20rem" h="20rem">
					<Text size="xl">
						Note Harbor is a web application created to help you write down
						notes, along with their sources, and tag them when conducting
						research projects. It is meant to help you stay organized and fetch
						only the notes you want to look at when you’re reviewing.
					</Text>
				</Box>
				<Box w="20rem" h="20rem" visibleFrom="sm">
					<Image radius="md" src="/HomePageSVG.svg" />
				</Box>
			</Flex>
			<Flex
				mt="5rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<Title fw={400} order={2} ta="center">
					How to use
				</Title>
			</Flex>
			<Flex
				mt="2rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				// wrap="wrap"
				visibleFrom="md"
			>
				<Card shadow="sm" padding="xs" withBorder radius="md" w="20rem" ml="md">
					<Card.Section>
						<Center>
							<AspectRatio ratio={1} w="60%">
								<Image
									src="/HomePage-HowToUse-Image1.svg"
									fit="contain"
									alt="Start a new project"
								/>
							</AspectRatio>
						</Center>
					</Card.Section>
					<Divider my="md" />
					<Text fw="500" size="lg">
						Create a project and start reading.
					</Text>
				</Card>
				<Image
					src="/arrowRight.svg"
					h={200}
					w={100}
					fit="contain"
					alt="arrow to the right"
				/>
				<Card shadow="sm" padding="xs" withBorder radius="md" w="20rem">
					<Card.Section>
						<Center>
							<AspectRatio ratio={1} w="60%">
								<Image
									src="/HomePage-HowToUse-Image2.svg"
									fit="contain"
									alt="Start a new project"
								/>
							</AspectRatio>
						</Center>
					</Card.Section>
					<Divider my="md" />
					<Text fw={500} size="lg">
						Conduct your research and create notes as you come across insightful
						ideas. Attach sources and tags to those notes.
					</Text>
				</Card>
				<Image
					src="/arrowRight.svg"
					h={200}
					w={100}
					fit="contain"
					alt="arrow to the right"
				/>
				<Card shadow="sm" padding="xs" withBorder radius="md" w="20rem" mr="md">
					<Card.Section>
						<Center>
							<AspectRatio ratio={1} w="60%">
								<Image
									src="/HomePage-HowToUse-Image3.svg"
									fit="contain"
									alt="Start a new project"
								/>
							</AspectRatio>
						</Center>
					</Card.Section>
					<Divider my="md" />
					<Text fw={200} size="lg">
						Review your notes by filtering based on note content, tags, or
						sources.
					</Text>
				</Card>
			</Flex>
			<Flex
				mt="2rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				hiddenFrom="md"
			>
				<Card shadow="sm" padding="xs" withBorder radius="md" w="20rem" ml="md">
					<Card.Section>
						<Center>
							<AspectRatio ratio={1} w="60%">
								<Image
									src="/HomePage-HowToUse-Image1.svg"
									fit="contain"
									alt="Start a new project"
								/>
							</AspectRatio>
						</Center>
					</Card.Section>
					<Divider my="md" />
					<Text fw={200} size="lg">
						Create a project and start reading.
					</Text>
				</Card>
			</Flex>
			<Flex
				mt="2rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				hiddenFrom="md"
			>
				<Image
					src="/arrowDown.svg"
					h={200}
					w={100}
					fit="contain"
					alt="arrow down"
				/>
			</Flex>
			<Flex
				mt="2rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				hiddenFrom="md"
			>
				<Card shadow="sm" padding="xs" withBorder radius="md" w="20rem">
					<Card.Section>
						<Center>
							<AspectRatio ratio={1} w="60%">
								<Image
									src="/HomePage-HowToUse-Image2.svg"
									fit="contain"
									alt="Start a new project"
								/>
							</AspectRatio>
						</Center>
					</Card.Section>
					<Divider my="md" />
					<Text fw={200} size="lg">
						Conduct your research and create notes as you come across insightful
						ideas. Attach sources and tags to those notes.
					</Text>
				</Card>
			</Flex>
			<Flex
				mt="2rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				hiddenFrom="md"
			>
				<Image
					src="/arrowDown.svg"
					h={200}
					w={100}
					fit="contain"
					alt="arrow to the right"
				/>
			</Flex>
			<Flex
				mt="2rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
				hiddenFrom="md"
			>
				<Card shadow="sm" padding="xs" withBorder radius="md" w="20rem" mr="md">
					<Card.Section>
						<Center>
							<AspectRatio ratio={1} w="60%">
								<Image
									src="/HomePage-HowToUse-Image3.svg"
									fit="contain"
									alt="Start a new project"
								/>
							</AspectRatio>
						</Center>
					</Card.Section>
					<Divider my="md" />
					<Text fw={200} size="lg">
						Review your notes by filtering based on note content, tags, or
						sources.
					</Text>
				</Card>
			</Flex>
			<Flex
				mt="5rem"
				mih={50}
				gap="md"
				justify="center"
				align="flex-start"
				direction="row"
			>
				<Image src="/logo.svg" h={200} w={200} alt="logo" />
			</Flex>
			<Flex
				mt="5rem"
				mih={50}
				gap="md"
				justify="end"
				align="flex-start"
				direction="row"
			>
				<div></div>
				<Anchor
					href="https://github.com/MohammedArab1/MeetupScheduler"
					target="_blank"
					c="black"
				>
					<IconBrandGithub stroke={1.5} />
				</Anchor>
			</Flex>
		</motion.div>
	);
};

export default Main;
