import { yupResolver } from '@hookform/resolvers/yup';
import {
	Alert,
	Button,
	Checkbox,
	Flex,
	Group,
	LoadingOverlay,
	TextInput,
	Transition,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { createProjectSchema } from '../../Utils/yupSchemas';
import { useAuth } from '../../customHooks/useAuth';
import { useMutations } from '../../customHooks/useMutations';
import { GenericModal } from './GenericModal';

export const CreateProjectModal = ({
	projects,
	setProjects,
	opened,
	close,
}) => {
	const { user } = useAuth();
	const { createProjectMutation, invalid } = useMutations();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(createProjectSchema),
	});

	const handleCreateProject = async (data) => {
		const { projectName, description, isPrivate } = data;
		createProjectMutation.mutate(
			{ projectName, description, isPrivate },
			{
				onSuccess: (data) => {
					setProjects([...projects, data]);
					close();
					setValue('projectName', '');
					setValue('description', '');
				},
			}
		);
	};
	return (
		<div>
			<GenericModal opened={opened} close={close} title="Create Project">
				<form
					onSubmit={handleSubmit((data) => {
						handleCreateProject(data);
					})}
				>
					{createProjectMutation.isLoading && (
						<LoadingOverlay
							visible={true}
							zIndex={1000}
							overlayProps={{ radius: 'sm', blur: 2 }}
						/>
					)}
					<Transition
						mounted={invalid.isInvalid}
						transition="fade"
						duration={400}
						timingFunction="ease"
					>
						{(styles) => (
							<div style={styles}>
								<Alert
									variant="light"
									color="red"
									title="Problem with creating project"
									icon={<IconInfoCircle />}
								>
									{invalid.message}
								</Alert>
							</div>
						)}
					</Transition>
					<TextInput
						error={errors.projectName ? true : false}
						placeholder={errors.projectName?.message || 'Your project name'}
						withAsterisk
						id="projectName"
						label="Project Name"
						{...register('projectName')}
						radius="md"
					/>
					<TextInput
						error={errors.description ? true : false}
						placeholder={
							errors.description?.message || 'Your project description'
						}
						id="description"
						label="Description"
						{...register('description')}
						radius="md"
					/>
					<Flex
						mih={20}
						mt={15}
						gap="md"
						justify="flex-start"
						align="flex-start"
						direction="row"
						wrap="wrap"
					>
						{user && (
							<Checkbox
								id="isPrivate"
								defaultChecked
								label="Private"
								{...register('isPrivate')}
							/>
						)}
					</Flex>

					<Group justify="center" mt="xl">
						<Button type="submit" variant="light" radius="md">
							Create Project
						</Button>
					</Group>
				</form>
			</GenericModal>
		</div>
	);
};
