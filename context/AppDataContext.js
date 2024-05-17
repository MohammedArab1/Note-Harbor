import { createContext } from 'react';

export const AppDataContext = createContext({
	project: {},
	setProject: (project) => {},
	tags: [],
	setTags: (tags) => {},
	subSections: [],
	setSubSections: (subSections) => {},
	allProjectNotes: [],
	setAllProjectNotes: (allProjectNotes) => {},
});
