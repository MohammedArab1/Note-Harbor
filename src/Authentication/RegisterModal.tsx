import { yupResolver } from '@hookform/resolvers/yup';
import {
	Alert,
	Button,
	Group,
	TextInput,
	Transition,
	rem,
} from '@mantine/core';
import { IconAt, IconInfoCircle, IconLock } from '@tabler/icons-react';
import { FieldValues, useForm } from 'react-hook-form';
import { useMutations } from '../../customHooks/useMutations';
import { registerSchema } from '../../Utils/yupSchemas';
import { GenericModal } from '../Components/GenericModal';
import { ModalProps } from '@mui/material';
import { CustomModalProps, RegisterRequest } from '../../types';

export const RegisterModal = ({ opened, close }:CustomModalProps) => {
	const atIcon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
	const lockIcon = (
		<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
	);
	const { registerMutation, invalid } = useMutations();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(registerSchema),
	});
	const handleRegister = async (data: FieldValues) => {
		const { firstName, lastName, email, password } = data as RegisterRequest;
		registerMutation.mutate({ firstName, lastName, email, password });
	};

	return (
		<>
			<GenericModal opened={opened} close={close} title="Sign up">
				<div>
					<form
						onSubmit={handleSubmit((data) => {
							handleRegister(data);
						})}
					>
						{registerMutation.isLoading && <p>Loading</p>}
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
										title="Problem with signup"
										icon={<IconInfoCircle />}
									>
										{invalid.message}
									</Alert>
								</div>
							)}
						</Transition>
						<Group grow mb="md" mt="md">
							<TextInput
								autoComplete="given-name"
								error={errors.firstName ? true : false}
								placeholder={errors.firstName?.message || 'Your first name'}
								withAsterisk
								id="firstName"
								label="First name"
								{...register('firstName')}
								radius="md"
							/>
							<TextInput
								autoComplete="family-name"
								error={errors.lastName ? true : false}
								placeholder={errors.lastName?.message || 'Your last name'}
								withAsterisk
								id="lastName"
								label="Last name"
								{...register('lastName')}
								radius="md"
							/>
						</Group>
						<TextInput
							leftSection={atIcon}
							autoComplete="email"
							error={errors.email ? true : false}
							placeholder={errors.email?.message || 'hello@something.dev'}
							withAsterisk
							id="email"
							label="Email"
							{...register('email')}
							radius="md"
						/>
						<TextInput
							leftSection={lockIcon}
							error={errors.password ? true : false}
							placeholder={errors.password?.message || 'Password'}
							id="password"
							withAsterisk
							label="Password"
							type="password"
							autoComplete="current-password"
							{...register('password')}
							radius="md"
						/>
						<TextInput
							leftSection={lockIcon}
							error={errors.cpassword ? true : false}
							placeholder={errors.cpassword?.message || 'Confirm Password'}
							id="cpassword"
							withAsterisk
							label="Confirm Password"
							type="password"
							autoComplete="current-password"
							{...register('cpassword')}
							radius="md"
						/>
						<Group justify="center" mt="xl">
							<Button variant="light" type="submit" radius="md">
								Signup
							</Button>
						</Group>
					</form>
				</div>
			</GenericModal>
		</>
	);
};
