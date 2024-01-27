import React from 'react';
import { Card, Flex, Text } from '@mantine/core';
import { format } from 'date-fns';

export const NoteDetailsCard = ({ noteDateCreated, noteCreatedBy, noteContent, onClick }) => {
    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            w={'100%'}
            h={'100%'}
            onClick={onClick}
            styles={{ root: { cursor: 'pointer' } }}
        >
            <Flex
                gap="md"
                align="flex-start"
                direction="row"
                wrap="wrap"
                justify={'space-between'}
            >
                <Text truncate="end" size="sm" c="dimmed">
                    {format(new Date(noteDateCreated), 'yyyy/MM/dd')}
                </Text>

                <Text truncate="end" size="sm" c="dimmed">
                    {noteCreatedBy || ""}
                </Text>
            </Flex>
            <Flex mt={'lg'} gap="md" direction="row" wrap="wrap">
                <Text lineClamp={3} fw={500} styles={{ root: { wordBreak: 'break-word' } }}>
                    {noteContent}
                </Text>
            </Flex>
        </Card>
    );
};

export default NoteDetailsCard;
