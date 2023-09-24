import {createContext} from 'react';

export const AppDataContext = createContext({
    tags: [],
    setTags: (tags) => {},
    sources: [],
    setSources: (sources) => {},
    subSections: [],
    setSubSections: (subSections) => {},
    notes: [],
    setNotes: (notes) => {},
})