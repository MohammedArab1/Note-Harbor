export const returnSessionObject = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export const isUserLeader = (userId) => {
  return returnSessionObject()?.id && returnSessionObject()?.id === userId;
}

export const setInvalidError = (setInvalid, error) => {
  setInvalid({isInvalid:true,message:error?.response?.data?.error || "There was an error with your request. Please try again later."})
  setTimeout(() => {
    setInvalid({isInvalid:false,message:""})
  }, 10000);
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

export const handleNoteCommentSubmit = (data, noteId, createCommentMutation, setValue, setComments, comments, closeReplyModal, inReplyTo = null) => {
  const commentData = {
    content: data.noteComment,
    note: noteId,
    ...(inReplyTo && { inReplyTo: inReplyTo })
  };
  createCommentMutation.mutate(commentData, {
    onSuccess: (data) => {
      if(closeReplyModal) {
        closeReplyModal()
      }
      setValue("noteComment", "")
      setComments([...comments, data])
    }
  })
}

export const isOfflineMode = () => {
  const offlineMode = localStorage.getItem("offlineMode")
  if (offlineMode === null || offlineMode === undefined || offlineMode === "") {
    return false
  }
  return offlineMode === "true"
};

export const getUniqueSources = (allProjectNotes) => {
  const allSources = allProjectNotes.reduce((accumulator, note) => {
    return accumulator.concat(note.sources);
  }, []);
  const calculatedUniqueSources = allSources.filter((source, index, self) =>  
  index === self.findIndex((t) => (
        t.source === source.source
    ))
  );
  return calculatedUniqueSources
}