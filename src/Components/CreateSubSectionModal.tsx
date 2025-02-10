import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, TextInput } from '@mantine/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { createSubSectionSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import ErrorAlert from './ErrorAlert';
import { GenericModal } from './GenericModal';
import mongoose from 'mongoose';
import { LoadingOverlay } from '@mantine/core';
import { ISubSection } from '../../types';

type SubsectionFormData = {
	description?: string,
	name: string
}

export const CreateSubSectionModal = ({
	subSections,
	setSubSections,
	projectId,
	opened,
	close,
}:{
	subSections: ISubSection[],
	setSubSections: (ss:ISubSection[]) => void,
	projectId: string
	opened: boolean,
	close: ()=>void
}) => {
	const { createSubSectionMutation, invalid } = useMutations();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(createSubSectionSchema),
	});

	const handleCreateSubSection = async (data: SubsectionFormData) => {
		var { name, description } = data;
		createSubSectionMutation.mutate(
			{name, description, project:projectId },
			{
				onSuccess: (data) => {
					setSubSections([...subSections, data]);
					setValue('name', '');
					setValue('description', '');
				},
			}
		);
	};
	return (
		<div>
			<GenericModal opened={opened} close={close} title="Create a subsection">
				<form
					onSubmit={handleSubmit((data: SubsectionFormData) => {
						handleCreateSubSection(data);
					})}
				>
					{createSubSectionMutation.isLoading && (
						<LoadingOverlay
							visible={true}
							zIndex={1000}
							overlayProps={{ radius: 'sm', blur: 2 }}
						/>
					)}
					<ErrorAlert
						invalid={invalid}
						title={'Problem with creating subsection'}
					/>
					<TextInput
						error={errors.name ? true : false}
						placeholder={errors.name?.message || 'Your subsection name'}
						withAsterisk
						id="name"
						label="Subsection name"
						{...register('name')}
						radius="md"
					/>
					<TextInput
						error={errors.description ? true : false}
						placeholder={
							errors.description?.message || 'Your subsection description'
						}
						id="description"
						label="Subsection description"
						{...register('description')}
						radius="md"
					/>
					<Group justify="center" mt="xl">
						<Button variant="text" type="submit">
							Create sub section
						</Button>
					</Group>
				</form>
			</GenericModal>
		</div>
	);
};
