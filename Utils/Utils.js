export const returnSessionObject = () => {
  return JSON.parse(sessionStorage.getItem('user'))
}

export const isUserLeader = (userId) => {
  return returnSessionObject().id === userId;
}

export const setInvalidError = (setInvalid, error) => {
  setInvalid({isInvalid:true,message:error.response.data.error})
  setTimeout(() => {
    setInvalid({isInvalid:false,message:""})
  }, 4000);
}

export const handleDeleteOneNote = (allProjectNotes, setAllProjectNotes, noteIdToBeDeleted, deleteNoteMutation) => {
  deleteNoteMutation.mutate([noteIdToBeDeleted], {
    //onError already handled for us at the level of the deleteNoteMutation definition
    onSuccess: (data) => {
      const newAllProjectNotes = allProjectNotes.filter(note => note._id !== noteIdToBeDeleted)
      setAllProjectNotes(newAllProjectNotes)
    }
  })
}

export const handleDeleteOneTag = (tags, setTags, tagIdToBeDeleted, deleteTagMutation) => {
  deleteTagMutation.mutate(tagIdToBeDeleted, {
    onSuccess: (data) => {
      const newTags = tags.filter(tag => tag._id !== tagIdToBeDeleted)
      setTags(newTags)
    }
  })
}

export const handleDeleteOneSubSection = (subSections, setSubSections, subSectionIdToBeDeleted, deleteSubSectionMutation) => {
  deleteSubSectionMutation.mutate(subSectionIdToBeDeleted,{
    onSuccess: (data) => {
      const newSubSections = subSections.filter(subSection => subSection._id !== subSectionIdToBeDeleted)
      setSubSections(newSubSections)
    }
  })
}

export const handleNoteCommentSubmit = (data, noteId, createCommentMutation, setValue, setComments, comments, inReplyTo = null) => {
  const commentData = {
    content: data.noteComment,
    note: noteId,
    ...(inReplyTo && { inReplyTo: inReplyTo })
  };
  createCommentMutation.mutate(commentData, {
    onSuccess: (data) => {
      setValue("noteComment", "")
      setComments([...comments, data])
    }
  })
}