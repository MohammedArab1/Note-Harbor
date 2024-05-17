import { Modal, ScrollArea } from '@mantine/core';

const CustomScrollArea = (props) => {
	return <ScrollArea.Autosize type="always" scrollbars="y" {...props} />;
};

export const GenericModal = ({
	opened,
	close,
	size,
	title,
	children,
	bgColor,
}) => {
	return (
		<>
			<Modal.Root
				opened={opened}
				onClose={close}
				size={size || 'md'}
				styles={{ header: { backgroundColor: bgColor || '#C3E0FB' } }}
				scrollAreaComponent={CustomScrollArea}
				centered
			>
				<Modal.Overlay backgroundOpacity={0.55} blur={7} />
				<Modal.Content>
					<Modal.Header mb={20}>
						<Modal.Title w={'100%'} ta={'center'} fz={25}>
							{title}
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					{/* had style={{maxWidth:'400px'}} on modal.body below, not sure why. might need to come back to this. */}
					<Modal.Body>{children}</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
