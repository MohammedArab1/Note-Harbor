import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Flex, TextInput } from '@mantine/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { createSubSectionSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';
import ErrorAlert from './ErrorAlert';
import { GenericModal } from './GenericModal';

export const CreateSubSectionModal = ({
	subSections,
	setSubSections,
	projectId,
	opened,
	close,
}) => {
	const { createSubSectionMutation, invalid } = useMutations();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(createSubSectionSchema),
	});

	const handleCreateSubSection = async (data) => {
		var { name, description } = data;
		createSubSectionMutation.mutate(
			{ name, description, projectId },
			{
				onSuccess: (data) => {
					setSubSections([...subSections, data]);
					setOpen(false);
					setValue('name', '');
					setValue('description', '');
				},
			}
		);
	};
	return (
		<>
			<GenericModal opened={opened} close={close} title="Create a subsection">
				<form
					onSubmit={handleSubmit((data) => {
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
					<Flex mt={15} gap="md" justify="center" direction="row" wrap="wrap">
						<Button variant="text" type="submit">
							Create sub section
						</Button>
					</Flex>
				</form>
			</GenericModal>
		</>
	);
};
