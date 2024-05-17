import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RegisterModal } from '../Authentication/RegisterModal';

export const RegisterButton = ({ variant, w, addFunctions }) => {
	const [registerModalOpened, registerModalHandler] = useDisclosure(false);
	const onRegisterClick = (e) => {
		if (addFunctions) {
			addFunctions.forEach((func) => {
				func();
			});
		}
		// localStorage.setItem('offlineMode', null) Not sure why this is necessary, might have to come back to it
		registerModalHandler.open();
	};

	return (
		<>
			<RegisterModal
				opened={registerModalOpened}
				close={registerModalHandler.close}
			/>
			<Button
				w={w}
				variant={variant}
				onClick={(e) => {
					onRegisterClick(e);
				}}
			>
				Signup
			</Button>
		</>
	);
};
