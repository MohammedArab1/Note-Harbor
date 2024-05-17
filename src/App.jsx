import { Grid } from '@mantine/core';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppDataContext } from '../context/AppDataContext';
import { AuthContext } from '../context/AuthContext';
import Login from './Authentication/Login';
import PrivateRoutes from './Authentication/PrivateRoutes';
import PublicRoutes from './Authentication/PublicRoutes';
import Register from './Authentication/Register';
import FetchProjectDetails from './Components/FetchProjectDetails';
import NavigationBar from './Components/NavigationBar';
import Main from './Home';
import ProjectDetails from './userPages/ProjectDetails';
import SubSectionDetails from './userPages/SubSectionDetails';
import UserHomePage from './userPages/UserHomePage';

const App = () => {
	const location = useLocation();
	const [user, setUser] = useState(null);
	const [invalid, setInvalid] = useState({ isInvalid: false, message: '' });
	const [project, setProject] = useState(null);
	const [tags, setTags] = useState([]);
	const [allProjectNotes, setAllProjectNotes] = useState([]);
	const [subSections, setSubSections] = useState([]);

	return (
		<AnimatePresence mode="wait">
			<Grid gutter={0}>
				<Grid.Col span={1}></Grid.Col>
				<Grid.Col span={10}>
					<AuthContext.Provider value={{ user, setUser, invalid, setInvalid }}>
						<AppDataContext.Provider
							value={{
								tags,
								setTags,
								allProjectNotes,
								setAllProjectNotes,
								subSections,
								setSubSections,
								project,
								setProject,
							}}
						>
							<div>
								<NavigationBar />
								<Routes location={location} key={location.key}>
									<Route index path="/" element={<Main />} />
									<Route element={<PublicRoutes />}>
										<Route path="/login" element={<Login />} />
										<Route path="/Register" element={<Register />} />
									</Route>

									<Route element={<PrivateRoutes />}>
										<Route path="/UserHome" element={<UserHomePage />} />
										<Route element={<FetchProjectDetails />}>
											<Route
												path="/ProjectDetails/:projectId"
												element={<ProjectDetails />}
											/>
											<Route
												path="/ProjectDetails/:projectId/SubSectionDetails/:subSectionId"
												element={<SubSectionDetails />}
											/>
										</Route>
									</Route>
									<Route path="*" element={<Navigate to="/" replace />} />
								</Routes>
							</div>
						</AppDataContext.Provider>
					</AuthContext.Provider>
				</Grid.Col>
				<Grid.Col span={1}></Grid.Col>
			</Grid>
		</AnimatePresence>
	);
};

export default App;
