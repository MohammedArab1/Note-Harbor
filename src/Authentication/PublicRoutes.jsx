import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../customHooks/useAuth';
import { isOfflineMode } from '../../Utils/Utils';

const PublicRoutes = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) return <p>Loading...</p>;
	return !user && !isOfflineMode() ? <Outlet /> : <Navigate to="/UserHome" />;
};

export default PublicRoutes;
