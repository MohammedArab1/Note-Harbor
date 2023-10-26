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
