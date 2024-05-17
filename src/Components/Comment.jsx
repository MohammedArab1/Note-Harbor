import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, Text, Textarea, Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useMutations } from '../../customHooks/useMutations';
import { handleNoteCommentSubmit } from '../../Utils/Utils';
import { createNoteCommentSchema } from '../../Utils/yupSchemas';

function Comment({ comment, noteId, setComments, comments }) {
	const [replyBoxOpened, replyBoxHandlers] = useDisclosure(false);
	const { createCommentMutation, invalid } = useMutations();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(createNoteCommentSchema),
	});
	return (
		<div>
			<Box style={{ backgroundColor: '#D9D9D9', borderRadius: '4px' }}>
				<Flex
					gap="md"
					align="flex-start"
					direction="row"
					wrap="wrap"
					justify={'space-between'}
					styles={{ root: { backgroundColor: '#D9D9D9', borderRadius: '4px' } }}
					p={5}
				>
					<Text truncate="end" size="sm" c="dimmed">
						{format(new Date(comment.dateCreated), 'yyyy/MM/dd')}
					</Text>
					<Text truncate="end" size="sm" c="dimmed">
						{comment.user?.firstName + ' ' + comment.user?.lastName || ''}
					</Text>
				</Flex>
				<Text fw={500} p={5}>
					{comment.content}
				</Text>
			</Box>
			<Flex align="flex-start" direction="row" wrap="wrap">
				<Button
					type="submit"
					variant="transparent"
					styles={{ root: { marginLeft: 'auto', marginRight: '0' } }}
					onClick={replyBoxHandlers.toggle}
				>
					<Text c={'dimmed'} size="xs">
						Reply
					</Text>
				</Button>
			</Flex>
			<Transition
				mounted={replyBoxOpened}
				transition="fade"
				duration={250}
				timingFunction="ease"
			>
				{(styles) => (
					<div style={styles}>
						<form
							onSubmit={handleSubmit((data) => {
								handleNoteCommentSubmit(
									data,
									noteId,
									createCommentMutation,
									setValue,
									setComments,
									comments,
									replyBoxHandlers.close,
									comment._id
								);
							})}
						>
							<Textarea
								variant="filled"
								withAsterisk
								error={errors.noteComment ? true : false}
								placeholder={errors.noteComment?.message || 'Your reply'}
								id="noteComment"
								{...register('noteComment')}
							/>
							<Flex align="flex-start" direction="row" wrap="wrap">
								<Button type="submit" variant="light" size="xs" m={10}>
									Post Reply
								</Button>
							</Flex>
						</form>
					</div>
				)}
			</Transition>
			{comment.children.map((childComment, i) => (
				<div key={i} style={{ marginLeft: '20px' }}>
					<Comment
						comment={childComment}
						noteId={noteId}
						comments={comments}
						setComments={setComments}
					/>
				</div>
			))}
		</div>
	);
}

export default Comment;
