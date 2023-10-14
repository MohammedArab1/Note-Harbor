import {createContext} from 'react';

export const AppDataContext = createContext({
    tags: [],
    setTags: (tags) => {},
    uniqueSources: [],
    setUniqueSources: (sources) => {},
    subSections: [],
    setSubSections: (subSections) => {},
    notes: [],
    setNotes: (notes) => {},
    allProjectNotes:[],
    setAllProjectNotes: (allProjectNotes) => {},
})