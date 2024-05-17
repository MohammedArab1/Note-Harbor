import { yupResolver } from '@hookform/resolvers/yup';
import {
	Alert,
	Button,
	Group,
	LoadingOverlay,
	PasswordInput,
	TextInput,
	Transition,
	rem,
} from '@mantine/core';
import { IconAt, IconInfoCircle, IconLock } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { useMutations } from '../../customHooks/useMutations';
import { loginSchema } from '../../Utils/yupSchemas';
import { GenericModal } from '../Components/GenericModal';

export const LoginModal = ({ opened, close }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(loginSchema),
	});
	const { loginMutation, invalid } = useMutations();
	const atIcon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
	const lockIcon = (
		<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
	);

	const handleLogin = async (data) => {
		const { email, password } = data;
		loginMutation.mutate({ password, email });
	};
	return (
		<>
			<GenericModal opened={opened} close={close} title="Login">
				<form
					onSubmit={handleSubmit((data) => {
						handleLogin(data);
					})}
				>
					{loginMutation.isLoading && (
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
									title="Problem with login"
									icon={<IconInfoCircle />}
								>
									{invalid.message}
								</Alert>
							</div>
						)}
					</Transition>
					<TextInput
						autoComplete="email"
						leftSection={atIcon}
						error={errors.email ? true : false}
						placeholder={errors.email?.message || 'hello@something.dev'}
						withAsterisk
						id="email"
						label="Email"
						{...register('email')}
						radius="md"
					/>
					<PasswordInput
						leftSection={lockIcon}
						error={errors.password ? true : false}
						placeholder={errors.password?.message || 'Password'}
						id="password"
						withAsterisk
						autoComplete="current-password"
						label="Password"
						type="password"
						{...register('password')}
						radius="md"
					/>

					<Group justify="center" mt="xl">
						<Button type="submit" variant="light" radius="md">
							Login
						</Button>
					</Group>
				</form>
			</GenericModal>
		</>
	);
};
