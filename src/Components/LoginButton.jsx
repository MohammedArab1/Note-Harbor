import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LoginModal } from '../Authentication/LoginModal';

export const LoginButton = ({ variant, w, addFunctions }) => {
	const [loginModalOpened, loginModalHandler] = useDisclosure(false);
	const onLoginClick = (e) => {
		if (addFunctions) {
			addFunctions.forEach((func) => {
				func();
			});
		}
		// localStorage.setItem('offlineMode', null) //Not sure why this is necessary, might have to come back to it
		loginModalHandler.open();
	};

	return (
		<>
			<LoginModal opened={loginModalOpened} close={loginModalHandler.close} />
			<Button
				w={w}
				variant={variant}
				onClick={(e) => {
					onLoginClick(e);
				}}
			>
				Login
			</Button>
		</>
	);
};
