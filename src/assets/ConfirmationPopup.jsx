import React, { useState } from 'react';
import {Button, Text, Group} from '@mantine/core';
import { GenericModal } from './GenericModal';
import { useDisclosure } from '@mantine/hooks';

const ConfirmationPopup = ({ title, message, onConfirm, actionComponent }) => {

const [isModalOpened, isModalOpenedHandler] = useDisclosure(false);

const handleConfirm = () => {
    onConfirm();
    isModalOpenedHandler.close();
};

const actionComponentWithOnClick = React.cloneElement(actionComponent, { onClick: (e)=>{isModalOpenedHandler.open()} });

return (
    <>
        {actionComponentWithOnClick}
        <GenericModal 
        opened={isModalOpened} 
        close={isModalOpenedHandler.close} 
        title={title} 
        bgColor={'#DDDFE0'}>
        <>
            {message || 
            <Text>
                {message}
            </Text>
            }
            <Group justify="flex-end">
                <Button onClick={(e) => isModalOpenedHandler.close()} variant="default">Cancel</Button>
                <Button onClick={(e) => handleConfirm(e)}>Confirm</Button>
            </Group>
            
        </>
        </GenericModal>
    </>
);
};

export default ConfirmationPopup;
