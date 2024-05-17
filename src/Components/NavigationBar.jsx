import {
	Burger,
	Button,
	Center,
	Divider,
	Drawer,
	Group,
	Menu,
	Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../customHooks/useAuth';
import classes from '../../styles/NavBar.module.css';
import { LoginButton } from '../Components/LoginButton';
import { RegisterButton } from '../Components/RegisterButton';

const NavigationBar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const links = [{ link: '/UserHome', label: 'Home' }];

	const [burgerOpened, { toggle }] = useDisclosure(false);
	const [active, setActive] = useState(links[0].link);

	const loggedInNavBar = () => {
		return (
			<header className={classes.header}>
				<div className={classes.inner}>
					<Group gap={1} visibleFrom="xs">
						<Text
							onClick={(e) => {
								onGenericClick(e, '/');
							}}
							mr={10}
						>
							Note Harbor
						</Text>
					</Group>
					<Group visibleFrom="sm">
						<Menu
							key={user.firstName + ' ' + user.lastName}
							trigger="hover"
							transitionProps={{ exitDuration: 0 }}
							withinPortal
						>
							<Menu.Target>
								<a
									href="#1"
									className={classes.link}
									onClick={(event) => event.preventDefault()}
								>
									<Center>
										<span className={classes.linkLabel}>
											{user.firstName + ' ' + user.lastName}
										</span>
										<IconChevronDown size="0.9rem" stroke={1.5} />
									</Center>
								</a>
							</Menu.Target>
							<Menu.Dropdown>
								{[
									<Menu.Item
										key={'/'}
										onClick={(e) => {
											onLogoutClick(e);
										}}
									>
										Logout
									</Menu.Item>,
								]}
							</Menu.Dropdown>
						</Menu>
					</Group>
					<Burger
						opened={burgerOpened}
						onClick={toggle}
						hiddenFrom="xs"
						size="sm"
					/>
					<Drawer
						opened={burgerOpened}
						onClose={toggle}
						size="80%"
						padding="md"
						title="Navigation"
						hiddenFrom="sm"
						zIndex={1000000}
						// keepMounted={true}
					>
						<Group>
							<Button
								component={Link}
								to={'/UserHome'}
								variant="default"
								onClick={toggle}
							>
								Home
							</Button>
							<Divider orientation="vertical" mr={5} ml={5} />
							<Button
								variant="light"
								onClick={(e) => {
									onLogoutClick(e);
									toggle();
								}}
							>
								Logout
							</Button>
						</Group>
					</Drawer>
				</div>
			</header>
		);
	};

	const loggedOutNavBar = () => {
		return (
			<header className={classes.header}>
				<div className={classes.inner}>
					<Group gap={1} visibleFrom="xs">
						<Text
							onClick={(e) => {
								onGenericClick(e, '/');
							}}
							mr={10}
						>
							Note Harbor
						</Text>
					</Group>
					<Group visibleFrom="sm">
						<LoginButton variant="default" />
						<Divider orientation="vertical" />
						<RegisterButton variant="light" addFunctions={[toggle]} />
					</Group>
					<Burger
						opened={burgerOpened}
						onClick={toggle}
						hiddenFrom="xs"
						size="sm"
					/>
					<Drawer
						opened={burgerOpened}
						onClose={toggle}
						size="100%"
						padding="md"
						title="Note Harbor"
						hiddenFrom="xs"
						zIndex={1000000}
						keepMounted={true}
					>
						<Group>
							<LoginButton variant="default" addFunctions={[toggle]} />
							<Divider orientation="vertical" mr={5} ml={5} />
							<RegisterButton variant="light" addFunctions={[toggle]} />
						</Group>
					</Drawer>
				</div>
			</header>
		);
	};

	const onLogoutClick = (e) => {
		e.preventDefault();
		logout();
		navigate('/');
	};

	const onGenericClick = (e, path) => {
		e.preventDefault();
		navigate(path);
	};
	return (
		<div>
			{user ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{loggedInNavBar()}
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{loggedOutNavBar()}
				</motion.div>
			)}
		</div>
	);
};

export default NavigationBar;
