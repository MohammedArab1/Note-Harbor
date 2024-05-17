import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { JoinProjectSchema } from '../../Utils/yupSchemas';
import { useMutations } from '../../customHooks/useMutations';

export const JoinProjectModal = ({ projects, setProjects }) => {
	const isScreenSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: isScreenSmall ? '80%' : 400,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(JoinProjectSchema),
	});
	const { joinProjectMutation, invalid } = useMutations();

	const handleJoinProject = async (data) => {
		const { accessCode } = data;
		joinProjectMutation.mutate(
			{ accessCode },
			{
				onSuccess: (data) => {
					const filteredProjects = projects.filter((project) => {
						return project.accessCode === data.accessCode;
					});
					if (!filteredProjects.length > 0) {
						setProjects([...projects, data]);
					}
					setOpen(false);
					setValue('accessCode', '');
				},
			}
		);
	};

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div>
			<Button onClick={handleOpen}>Join a Project</Button>
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={style}
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={handleSubmit((data) => {
						handleJoinProject(data);
					})}
				>
					{invalid.isInvalid && <p>{invalid.message}</p>}
					<TextField
						error={errors.accessCode ? true : false}
						helperText={errors.accessCode?.message}
						required
						id="accessCode"
						label="Access Code"
						{...register('accessCode')}
					/>

					<Button variant="text" type="submit">
						Join project
					</Button>
				</Box>
			</Modal>
		</div>
	);
};
