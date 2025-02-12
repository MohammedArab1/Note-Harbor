import axios, { AxiosError, AxiosResponse } from 'axios';
import { db } from '../offlineDB/db';
import { isOfflineMode, returnSessionObject } from './Utils';
import Dexie from 'dexie';
import {INote, IProject, ISubSection, IUser, LoginPayload, LoginRequest, NoteWithTags, RegisterRequest, Result} from "../types" 
import { ErrorPayload } from 'vite';
import mongoose, { ObjectId } from 'mongoose';
import { v4 } from 'uuid';


var baseUrl = import.meta.env.VITE_REACT_APP_API_URL
if (import.meta.env.PROD) {
  baseUrl = "/api"
}

axios.interceptors.request.use(function (config) {
  try {
    const sessionObject = returnSessionObject()
    config.headers['Authorization'] = `Bearer ${sessionObject.token}`
    return config
  } catch (error) {
    return config
  }
}, function (error) {
  return Promise.reject(error);
});


async function genericQuery<T>(f: () => Promise<AxiosResponse<any, any>>): Promise<T> {
  try {
    const res = await f()
    return res.data as T
  } catch (error:any) {
    throw error.response?.data as ErrorPayload;
  }
}

async function genericQueryWithOffline<T>(f: () => Promise<AxiosResponse<any, any>>, offline:() => Promise<T>): Promise<T> {
  try {
    if (isOfflineMode()) {
      const res = await offline()
      return res
    } else {
      const res = await f()
      return res.data as T
    }
  } catch (error:any) {
    throw error.response?.data as ErrorPayload;
  }
}

//DONE
export const loginQuery = async (credentialObject:LoginRequest):Promise<LoginPayload> =>{
  return genericQuery(async ()=>{
    return await axios.post(`${baseUrl}/login`, credentialObject);
  })
}
//DONE
export const registerQuery = async (userObject:RegisterRequest):Promise<LoginPayload> => {
  return genericQuery(async()=>{
    return axios.post(`${baseUrl}/user/register`, userObject)
  })
}
//DONE
export const fetchProjectPerUserId = async ():Promise<IProject[]>  => {
  return genericQueryWithOffline(
    async()=>{
      return axios.get(`${baseUrl}/project`)
    },
    async()=>{
      const projects = await db.project.toArray()
      return projects
    }   
  ) 
}
//DONE
export const fetchProjectById = async (projectId: string):Promise<IProject> => {
  
  return genericQueryWithOffline(
    async()=>{
      return axios.get(`${baseUrl}/project/${projectId}`)
    },
    async()=>{
      const project = await db.project.get({_id:projectId})
      if (!project){
        throw new Error('Project does not exist!');
      }
      return project
    }   
  ) 
}
//DONE
export const createProjectQuery = async (projectObject: IProject) => {
  return genericQueryWithOffline(
    async()=>{
      return axios.post(`${baseUrl}/project`, projectObject)
    },
    async()=>{
      projectObject._id = v4()
      const newProjectId = await db.project.add(projectObject)
      const newProject = await db.project.get(newProjectId)
      if (!newProject){
        throw new Error('Cannot create project');
      }
      return newProject
    }   
  ) 

}

export const joinProjectQuery = (projectObject: IProject) => {
  return genericQuery(async()=>{
    return axios.put(`${baseUrl}/project`, projectObject)
  })
}

//DONE FOR ONLINE
export const deleteProjectQuery = async(projectIdToDelete: number) => {
  const projectId = projectIdToDelete.toString()
  return genericQueryWithOffline(
    async()=>{
      return axios.delete(`${baseUrl}/project/${projectId}`)
    },
    async()=>{
      return db.transaction('rw', [db.project, db.subSection, db.note, db.comment, db.tag], async () => {
        // First make sure that project exists
        const project = await db.project.get({_id:Number(projectId)});
        if (!project) {
            throw new Error('Project does not exist!');
        }
        // Fetch all subsections to be deleted
        const subsectionsToBeDeleted = await db.subSection.where('project').equals(projectId).toArray();
        if (subsectionsToBeDeleted.length > 0) {
          const subSectionIds = subsectionsToBeDeleted.map(subsection => subsection._id || "");
          // Delete the appropriate subsections
          await db.subSection.where('_id').anyOf(subSectionIds).delete();
        }
        // Delete the appropriate tags
        await db.tag.where('project').equals(projectId).delete();
        // Get all notes associated with the project to be deleted
        const notesToBeDeleted = await db.note.where('project').equals(projectId).toArray();
        if (notesToBeDeleted.length > 0){
          const noteIds = notesToBeDeleted.map(note => note._id || "");
          // Delete all comments that have these notes to be deleted
          await db.comment.where('note').anyOf(noteIds).delete();
        }
        // Delete the appropriate Notes
        await db.note.where('project').equals(projectId).delete();
        // Finally delete the actual project
        const deletedProject = await db.project.delete(project._id);
        return deletedProject;
      })
    }
  )
}

export const leaveProjectQuery = (projectId:number,newProject:IProject) => {
  axios.put(`${baseUrl}/project/${projectId}`, newProject)
}

//DONE FOR ONLINE
export const createSubSectionQuery = async (subSectionObject: ISubSection) => {  
  return genericQueryWithOffline(
    async()=>{
      return axios.post(`${baseUrl}/subsection`, subSectionObject)
    },
    async()=>{
      const _id = v4()
      const newSubSectionId = await db.subSection.add({
        _id,
        project:subSectionObject.project,
        name:subSectionObject.name,
        description:subSectionObject.description
      })
      const newSubSection = await db.subSection.get(newSubSectionId)
      
      if (!newSubSection){
        throw new Error('Cannot create subsection');
      }
      return newSubSection
    }   
  ) 
  
}

export const createNoteQuery = async (noteObject: NoteWithTags) => {
  // if (isOfflineMode()) {
  //   const newNoteId = await db.note.add({
  //     project:Number(noteObject.projectId) || null,
  //     subSection:Number(noteObject.subSectionId) || null,
  //     content:noteObject.content,
  //     dateCreated:Date.now(),
  //     dateUpdated:Date.now(),
  //     sources:noteObject.sources,
  //   })
  //   let newNote = await db.note.get(newNoteId)

  //   if (noteObject.tags && Array.isArray(noteObject.tags) && noteObject.tags.length > 0) {
  //     await db.transaction('rw', db.tag, async () => {
  //       // Fetch existing tags
  //       const existingTags = await db.tag.bulkGet(noteObject.tags);
    
  //       // Create or update tags
  //       await Promise.all(noteObject.tags.map(async (tag, index) => {
  //           const existingTag = existingTags[index];
  //           if (existingTag) {
  //               await db.tag.update(tag, {
  //                 notes: existingTag.notes ? [...existingTag.notes, newNoteId] : [newNoteId]
  //               });
  //           } else {
  //               await db.tag.put({
  //                   _id: tag,
  //                   notes: [newNoteId]
  //               });
  //           }
  //       }))
  //     })
  //     const updatedTags = await db.tag.bulkGet(noteObject.tags)
      
  //     newNote = {
  //       ...newNote,
  //       tags: updatedTags
  //     }
  //   }
  //   return newNote

  // }
  // return axios.post(`${baseUrl}/note`, noteObject)
  // .then((res) => {
  //   return res.data
  // })

  return genericQueryWithOffline(
    async()=>{
      return axios.post(`${baseUrl}/note`, noteObject)
    },
    async()=>{
        const _id = v4()
        const newNoteId = await db.note.add({
          _id,
          project:noteObject.project,
          subSection:noteObject.subSection,
          content:noteObject.content,
          dateCreated:new Date(Date.now()),
          dateUpdated:new Date(Date.now()),
          sources:noteObject.sources,
        })
        if (!newNoteId) {
          throw new Error('Cannot create note');
        }
        let newNote = await db.note.get(newNoteId) as NoteWithTags
        if (noteObject.tags && noteObject.tags.length > 0) {
          await db.transaction('rw', db.tag, async () => {
            // Fetch existing tags
            // const existingTags = await db.tag.bulkGet(noteObject.tags);
            const existingTags = await db.tag.bulkGet(noteObject.tags?.map((tag)=>{
              return tag
            }) || []);

        
            // Create or update tags
            await Promise.all(noteObject.tags?.map(async (tag, index) => {
                const existingTag = existingTags[index];
                if (existingTag) {
                    await db.tag.update(tag, {
                      notes: existingTag.notes ? [...existingTag.notes, newNoteId] : [newNoteId]
                    });
                } else {
                    await db.tag.put({
                        _id: tag,
                        notes: [newNoteId]
                    });
                }
            }) || [])
          })
          const updatedTags = await db.tag.bulkGet(noteObject.tags)
          
          newNote = {
            ...newNote,
            tags: updatedTags?.map((tag)=>tag?._id || "") || []
          }
        }
        return newNote
    })
}

export const updateNoteQuery = async (noteObject) => {

  if (isOfflineMode()) {
    await db.note.update(noteObject.noteId,{
      content:noteObject.content,
      dateUpdated:Date.now(),
      sources:noteObject.sources,
    })
    let newNote = await db.note.get(noteObject.noteId)
    //only for update
    await db.tag.where('notes').equals(noteObject.noteId).modify(tag => {
      tag.notes = tag.notes.filter(noteId => noteId !== noteObject.noteId);
    });
  
    if (noteObject.tags && Array.isArray(noteObject.tags) && noteObject.tags.length > 0) {
      await db.transaction('rw', db.tag, async () => {
        // Fetch existing tags
        const existingTags = await db.tag.bulkGet(noteObject.tags);
    
        // Create or update tags
        await Promise.all(noteObject.tags.map(async (tag, index) => {
            const existingTag = existingTags[index];
            if (existingTag) {
                await db.tag.update(tag, {
                  notes: existingTag.notes ? [...existingTag.notes, noteObject.noteId] : [noteObject.noteId]
                });
            } else {
                await db.tag.put({
                    _id: tag,
                    notes: [noteObject.noteId]
                });
            }
        }))
      })
      const updatedTags = await db.tag.bulkGet(noteObject.tags)
      
      newNote = {
        ...newNote,
        tags: updatedTags
      }
    }
    return newNote
  }
  return axios.patch(`${baseUrl}/note/${noteObject.noteId}`, {noteObject}).then(res => res.data)
}

export const createTagQuery = async (tagObject) => {
  if (isOfflineMode()) {
    const newTagId = await db.tag.add({
      project:Number(tagObject.projectId),
      tagName:tagObject.tagName,
      notes:[],
      colour:tagObject.colour
    })
    const newTag = await db.tag.get(newTagId)
    return newTag
  }
  return axios.post(`${baseUrl}/tag`, tagObject)
  .then((res) => {
    return res.data
  })
}

export const updateTagNoteQuery = ({tagIds,note}) => {
  if (isOfflineMode()) {
    return db.transaction('rw', db.tag, async () => {
      // Iterate over each tagId
      for (let tagId of tagIds) {
          // Get the tag by tagId
          const tag = await db.tag.get(tagId);
          // If the tag doesn't exist, throw an error
          if (!tag) {
              throw new Error('Tag not found');
          }
          // Update the 'notes' array field to include the 'note'
          tag.notes.push(note);
          // Update the tag in the database
          await db.tag.put(tag);
      }
    })
  }
  const promises = tagIds.map(tagId => 
    axios.patch(`${baseUrl}/tag/${tagId}`, {note})
        .then(res => res.data)
  );
  return Promise.all(promises);
}

export const createCommentQuery = async (commentObject) => {
  if (isOfflineMode()) {
    const newComment = {
        content: commentObject.content,
        inReplyTo: commentObject.inReplyTo || null,
        note: commentObject.note,
        dateCreated: Date.now(),
    };
    // Save the new comment
    const commentId = await db.comment.add(newComment);
    // Fetch the saved comment
    // const savedComment = await db.comment.get(commentId);
    const savedComment = await db.comment.where('_id').equals(commentId).first();
    // If the comment has a note or inReplyTo, populate those fields
    if (savedComment.note) {
        // savedComment.note = await db.note.get(savedComment.note);
        savedComment.note = await db.note.where('_id').equals(savedComment.note).first();
    }
    if (savedComment.inReplyTo) {
        // savedComment.inReplyTo = await db.comments.get(savedComment.inReplyTo);
        savedComment.inReplyTo = await db.comment.where('_id').equals(savedComment.inReplyTo).first();
    }
    return savedComment;
  }
  return axios.post(`${baseUrl}/comment`, commentObject)
  .then((res) => {
    return res.data
  })
}

export const deleteNoteQuery = async (noteIds) => {
  if (isOfflineMode()) {
    return db.transaction('rw', db.comment, db.tag, db.note, async () => {
      // Delete appropriate comments first
      await db.comment.where('note').anyOf(noteIds).delete();
      // Then update the notes array in the Tag model to no longer hold this note(s)
      const tagsWithNotes = await db.tag.where('notes').anyOf(noteIds).toArray();
      for (let tag of tagsWithNotes) {
          tag.notes = tag.notes.filter(noteId => !noteIds.includes(noteId));
          await db.tag.put(tag);
      }
      // Then delete the actual notes
      const deletedNote = await db.note.where('_id').anyOf(noteIds).delete();
      return deletedNote;
    })
  }
  return axios.post(`${baseUrl}/note/deleteMany`, {noteIds:noteIds})
  .then((res) => {
    return res.data
  })
}

export const deleteSubSectionQuery = async (subSectionId) => {
  if (isOfflineMode()) {
    return db.transaction('rw', db.subSection, db.note, db.comment, async () => {
      // Find all the notes that have this subsection in the subsection field
      const notesToBeDeleted = await db.note.where('subSection').anyOf([subSectionId]).toArray();
      const noteIds = notesToBeDeleted.map(note => note._id);

      // Delete all comments that have these notes to be deleted
      if (noteIds.length > 0){
        await db.comment.where('note').anyOf(noteIds).delete();
      }

      // Then have to delete the appropriate Notes
      await db.note.where('subSection').anyOf([subSectionId]).delete();

      // Finally delete the appropriate subsection
      const deletedSubsections = await db.subSection.where('_id').anyOf([subSectionId]).delete();

      return deletedSubsections;
    })
  }
  return axios.delete(`${baseUrl}/subsection/${subSectionId}`)
  .then(
    res => res.data
  )
}

export const deleteTagQuery = async (tagId) => {
  if (isOfflineMode()) {
    const deletedTags = await db.tag.where('_id').anyOf(tagId).delete();
    return deletedTags
  }
  return axios.delete(`${baseUrl}/tag/${tagId}`)
  .then(
    res => res.data
  )
}

export const fetchSubSectionsPerProjectId = async (projectId: number | ObjectId) => {
  console.log("fetching subsections per project id");
  
  if (isOfflineMode()) {
    // const subsections = await db.subSection.where("project").equals(objectIdProject).toArray()
    if (typeof projectId === "number"){
      const subsections = await db.subSection.where("project").equals(projectId).toArray()
      return subsections
    }

  }
  return axios.get(`${baseUrl}/subsection/${projectId}`)
  .then(
    res => res.data
  )
}

export const fetchNotesPerProjectId = async (projectId) => {
  if (isOfflineMode()) {
    const notes = await db.note.where("project").equals(Number(projectId)).toArray()
    return notes
  }
  return axios.get(`${baseUrl}/note/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const fetchTagsPerProjectId = async (projectId) => {
  if (isOfflineMode()) {
    const tags = await db.tag.where("project").equals(Number(projectId)).toArray()
    for (let tag of tags) {
      if (tag.notes && tag.notes.length > 0) {
        for (let i = 0; i < tag.notes.length; i++) {
          let noteId = tag.notes[i];
          let note = await db.note.get(noteId);
          tag.notes[i] = note;
        }
      }
    }
    return {
      tags
    }
  }
  return axios.get(`${baseUrl}/tag/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const fetchAllNotesForProject = async (projectId,subsectionIds) => {
  if (isOfflineMode()) {
    let notes
    if (subsectionIds.length > 0) {
      notes = await db.note
          .where('project')
          .equals(Number(projectId))
          .or('subSection')
          .anyOf(subsectionIds)
          .toArray();
    } else {
        notes = await db.note
            .where('project')
            .equals(Number(projectId))
            .toArray();
    }
    const tags = await db.tag.where('project').equals(Number(projectId)).toArray()
    for (let note of notes) {
      note.tags = tags.filter(tag => tag.notes.some(noteId => {
        return noteId === note._id
      }))
    }
    return notes
  }
  return axios.post(`${baseUrl}/note/allNotes`,{projectId,subsectionIds})
  .then(
    res => res.data
  )
}

export const fetchCommentsPerNoteId = async(noteId) => {
  if (isOfflineMode()) {
    const returnedComments = await db.comment.where("note").equals(Number(noteId)).toArray()
    for (let comment of returnedComments) {
      if (comment.inReplyTo) {
        comment.inReplyTo = await db.comment.where("_id").equals(comment.inReplyTo).first()
      }
      if (comment.note) {
        comment.note = await db.note.where("_id").equals(comment.note).first()
      }
    }
    return returnedComments
  }
  return axios.get(`${baseUrl}/comment/note/${noteId}`)
  .then(
    res => res.data
  )
}