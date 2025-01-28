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
import { GoogleLogin } from '@react-oauth/google';
import { IconAt, IconInfoCircle, IconLock } from '@tabler/icons-react';
import jwt_decode from 'jwt-decode';
import { FieldValue, FieldValues, useForm } from 'react-hook-form';
import { useMutations } from '../../customHooks/useMutations';
import { setInvalidError } from '../../Utils/Utils';
import { loginSchema } from '../../Utils/yupSchemas';
import { GenericModal } from '../Components/GenericModal';
import { CustomModalProps, LoginRequest } from '../../types';
import { ModalProps } from '@mui/material';

export const LoginModal = ({ opened, close }:CustomModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(loginSchema),
	});
	const { loginMutation, invalid, setInvalid } = useMutations();
	const atIcon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
	const lockIcon = (
		<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
	);

	const handleLogin = async (data: FieldValues) => {
		const { email, password } = data as LoginRequest;
		loginMutation.mutate({ email, password });
	};
	const handleGoogleLogin = async (data: FieldValues) => {
		const { email, password, authProvider } = data as LoginRequest;
		loginMutation.mutate({email,password,authProvider});
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
					{/* <Group justify="center" mt="xl">
						<GoogleLogin
							onSuccess={(credentialResponse) => {
								const decodedJwt = jwt_decode(credentialResponse.credential);
								handleGoogleLogin({
									email: decodedJwt.email,
									provider: 'google',
									firstName: decodedJwt.given_name,
									lastName: decodedJwt.family_name,
								});
							}}
							onError={() => {
								setInvalidError(setInvalid, 'Error with Google Login');
							}}
						/>
					</Group> */}
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
