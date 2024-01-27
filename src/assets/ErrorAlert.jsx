import React from 'react';
import { Alert, Transition} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export const ErrorAlert = ({ invalid, title }) => {
    return (
        <Transition
            mounted={invalid.isInvalid}
            transition="fade"
            duration={400}
            timingFunction="ease"
        >
            {(styles) => (
                <div style={styles}>
                    <Alert variant="light" color="red" title={title} icon={<IconInfoCircle />}>
                        {invalid.message}
                    </Alert>
                </div>
            )}
        </Transition>
    );
};

export default ErrorAlert;
