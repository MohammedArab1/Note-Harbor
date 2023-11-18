import { useState } from 'react';
import { handleNoteCommentSubmit } from '../../Utils/Utils';
import { useForm } from 'react-hook-form';
import { createNoteCommentSchema } from '../../Utils/yupSchemas';
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, TextField, Button } from '@mui/material';
import { useMutations } from '../../customHooks/useMutations';


function Comment({ comment, noteId, setComments, comments }) {
	const {createCommentMutation,invalid} = useMutations()

    const {register, handleSubmit, formState:{errors}, setValue, control} = useForm({
		resolver:yupResolver(createNoteCommentSchema) 
	})
    return (
        <div>
            <p>{comment.content}</p>
            <Box
					component="form"
					noValidate
					autoComplete="off"
					onSubmit={handleSubmit((data)=>{handleNoteCommentSubmit(data, noteId,createCommentMutation,setValue,setComments, comments, comment._id)})}>
						<TextField 
							multiline
							error={errors.noteComment ? true : false}
							helperText={errors.noteComment?.message}
							id="noteComment"
							required
							label="Note Commment"
							{...register("noteComment")}
						/>
						<Button variant="text" type="submit">Add Comment</Button>
            </Box>
            {comment.children.map((childComment,i) => (
                <div key={i} style={{ marginLeft: '20px' }}>
                    <Comment comment={childComment} noteId={noteId} comments={comments} setComments={setComments} />
                </div>
            ))}
        </div>
    );
}

export default Comment