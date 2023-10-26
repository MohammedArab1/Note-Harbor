import {createContext} from 'react';

export const AppDataContext = createContext({
    project:{},
    setProject:(project)=>{},
    tags: [],
    setTags: (tags) => {},
    subSections: [],
    setSubSections: (subSections) => {},
    allProjectNotes:[],
    setAllProjectNotes: (allProjectNotes) => {},
})

/*
    deciding on what fields I need in my context:
    tags, subsections, allProjectNotes
    don't need anyhing else, because everything else can be derived from these three. Comments will be fetched as you visit each note.
    todo next is to create a parent component that fethes and sets these values, then projectDetails and SubSectionDetails are children of it. 
*/