import axios from 'axios'
import { returnSessionObject } from './Utils'
import { db } from '../offlineDB/db';
import { useLiveQuery } from "dexie-react-hooks";
import { isOfflineMode } from './Utils';

const baseUrl = import.meta.env.VITE_REACT_APP_API_URL


// Request interceptors for API calls. This will add the token to the header of every request
axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = returnSessionObject() ? `Bearer ${returnSessionObject().token}` : null
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// // Response interceptors for API calls. This will check if the token is expired and redirect to login page if it is
// axios.interceptors.response.use((response) => {
//   return response;
// }, (error) => {
//   if (error.response.data.error === "jwt expired" ) {
//     window.location.href = '/login'
//   }
//   return Promise.reject(error);
// });


// const isOfflineMode = () => {
//   const offlineMode = localStorage.getItem("offlineMode")
//   if (offlineMode === null || offlineMode === undefined || offlineMode === "") {
//     return false
//   }
//   return offlineMode === "true"
// };

export const loginQuery = userObject =>{
  return axios.post(`${baseUrl}/login`, userObject)
  .then(
    res => res.data
  )
}

export const registerQuery = userObject => {
  return axios.post(`${baseUrl}/user/register`, userObject)
  .then(
    res => res.data
  )
}

export const fetchProjectPerUserId = async () => {
  if (isOfflineMode()) {
    const projects = await db.project.toArray()
    return {
      project:projects
    }
  }
  return axios.get(`${baseUrl}/project`)
  .then(
    res => res.data
  )
}
export const fetchProjectById = async (projectId) => {
  if (isOfflineMode()) {
    const project = await db.project.get({_id:Number(projectId)})
    return {
      project
    }
  }
  return axios.get(`${baseUrl}/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const createProjectQuery = async (projectObject) => {
  if (isOfflineMode()) {
    const newProjectId = await db.project.add({
      creationDate:Date.now(),
      projectName:projectObject.projectName,
      description:projectObject.description
    })
    const newProject = await db.project.get(newProjectId)
    return newProject
  }
  return axios.post(`${baseUrl}/project`, projectObject)
  .then(
    res => res.data
  )
}

export const joinProjectQuery = (projectObject) => {
  return axios.put(`${baseUrl}/project`, projectObject)
  .then(
    res => res.data
  )
}


export const deleteProjectQuery = async(projectId) => {
  if (isOfflineMode()) {
    return db.transaction('rw', db.project, db.subSection, db.note, db.comment, db.tag, async () => {
      projectId = Number(projectId)
      // First make sure that project exists
      const project = await db.project.get(projectId);
      if (!project) {
          throw new Error('Project does not exist!');
      }
      // Fetch all subsections to be deleted
      const subsectionsToBeDeleted = await db.subSection.where('project').equals(projectId).toArray();
      if (subsectionsToBeDeleted.length > 0) {
        const subSectionIds = subsectionsToBeDeleted.map(subsection => subsection._id);
        // Delete the appropriate subsections
        await db.subSection.where('_id').anyOf(subSectionIds).delete();
      }
      // Delete the appropriate tags
      await db.tag.where('project').equals(projectId).delete();
      // Get all notes associated with the project to be deleted
      const notesToBeDeleted = await db.note.where('project').equals(projectId).toArray();
      if (notesToBeDeleted.length > 0){
        const noteIds = notesToBeDeleted.map(note => note._id);
        // Delete all comments that have these notes to be deleted
        await db.comment.where('note').anyOf(noteIds).delete();
      }
      // Delete the appropriate Notes
      await db.note.where('project').equals(projectId).delete();
      // Finally delete the actual project
      const deletedProject = await db.project.delete(projectId);
      return deletedProject;
    })
  }
  return axios.delete(`${baseUrl}/project/${projectId}`)
  .then(
    res => res.data
  )
}

export const leaveProjectQuery = ({projectId,newProject}) => {
  return axios.put(`${baseUrl}/project/${projectId}`, newProject)
  .then(
    res => res.data
  )
}

export const createSubSectionQuery = async (subSectionObject) => {
  if (isOfflineMode()) {
    const newSubSectionId = await db.subSection.add({
      project:Number(subSectionObject.projectId),
      name:subSectionObject.name,
      description:subSectionObject.description
    })
    const newSubSection = await db.subSection.get(newSubSectionId)
    return newSubSection
  }
  return axios.post(`${baseUrl}/subsection`, subSectionObject)
  .then(
    res => res.data
  )
}

export const createNoteQuery = async (noteObject) => {
  if (isOfflineMode()) {
    const newNoteId = await db.note.add({
      project:Number(noteObject.projectId) || null,
      subSection:Number(noteObject.subSectionId) || null,
      content:noteObject.content,
      dateCreated:Date.now(),
      dateUpdated:Date.now(),
      sources:noteObject.sources,
    })
    const newNote = await db.note.get(newNoteId)
    return newNote
  }
  return axios.post(`${baseUrl}/note`, noteObject)
  .then((res) => {
    return res.data
  })
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

export const fetchSubSectionsPerProjectId = async (projectId) => {
  if (isOfflineMode()) {
    const subsections = await db.subSection.where("project").equals(Number(projectId)).toArray()
    return subsections
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