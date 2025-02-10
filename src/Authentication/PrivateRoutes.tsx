import { LoadingOverlay } from '@mantine/core';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../customHooks/useAuth';
import { isOfflineMode } from '../../Utils/Utils';

const PrivateRoutes = () => {
	const { user, isLoading } = useAuth();

	if (isLoading)
		return (
			<LoadingOverlay
				visible={true}
				zIndex={1000}
				overlayProps={{ radius: 'sm', blur: 2 }}
			/>
		);
	return user || isOfflineMode() ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
