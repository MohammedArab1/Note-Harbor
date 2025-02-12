import { yupResolver } from '@hookform/resolvers/yup';
import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	Flex,
	LoadingOverlay,
	TextInput,
	Transition,
} from '@mantine/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { getUniqueSources } from '../../Utils/Utils';
import { createNoteSchema } from '../../Utils/yupSchemas';
import { AppDataContext } from '../../context/AppDataContext';
import { useMutations } from '../../customHooks/useMutations';
import ErrorAlert from './ErrorAlert';
import { GenericModal } from './GenericModal';
import { TagMultiSelect } from './TagMultiSelect';

export const CreateNoteModal = ({ projectId, subSectionId, opened, close }) => {
	const { allProjectNotes, setAllProjectNotes, tags, setTags } =
		React.useContext(AppDataContext);

	const { createNoteMutation, updateTagNoteMutation, invalid } = useMutations();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(createNoteSchema),
	});
	const [uniqueSources, setUniqueSources] = React.useState([]);
	const [selectedTags, setSelectedTags] = React.useState([]);
	const [addSource, setAddSource] = React.useState(false);
	const [userSourceInput, setUserSourceInput] = React.useState('');
	const [
		userAdditionalSourceInformationInput,
		setUserAdditionalSourceInformationInput,
	] = React.useState('');
	const [selectValues, setSelectValues] = React.useState([]);
	const handleAddSource = () => {
		setAddSource(!addSource);
	};

	React.useEffect(() => {
		setUniqueSources(getUniqueSources(allProjectNotes));
	}, [allProjectNotes]);

	React.useEffect(() => {
		setSelectValues(
			tags.map((tag) => {
				return {
					value: tag._id,
					label: tag.tagName,
					color: tag.colour,
				};
			})
		);
	}, [tags]);
	const handleCreateNote = async (data) => {
		const { content } = data;
		createNoteMutation.mutate(
			{
				content,
				projectId: projectId || null,
				subSectionId: subSectionId || null,
				sources: userSourceInput
					? [
							{
								source: userSourceInput,
								additionalSourceInformation:
									userAdditionalSourceInformationInput,
							},
					  ]
					: [],
				tags: selectedTags,
			},
			{
				onSuccess: (data) => {
					setAllProjectNotes([...allProjectNotes, data]);
					if (selectedTags && selectedTags.length > 0) {
						const newTags = tags.map((tag) => {
							// Find the corresponding tag in the data array
							const dataTag = data.tags.find((d) => d._id === tag._id);
							// If the tag is in the data array, update its notes field
							if (dataTag) {
								return { ...tag, notes: dataTag.notes };
							}
							// If the tag is not in the data array, return it as is
							return tag;
						});
						setTags(newTags);
						setValue('content', '');
						setValue('source', '');
						setValue('additionalSourceInformation', '');
						setSelectedTags([]);
						setAddSource(false);
					} else {
						setValue('content', '');
						setValue('source', '');
						setValue('additionalSourceInformation', '');
						setAddSource(false);
					}
				},
			}
		);
	};

	return (
		<div>
			<GenericModal opened={opened} close={close} title="Create a note">
				<form
					onSubmit={handleSubmit((data) => {
						handleCreateNote(data);
					})}
				>
					{createNoteMutation.isFetching && (
						<LoadingOverlay
							visible={true}
							zIndex={1000}
							overlayProps={{ radius: 'sm', blur: 2 }}
						/>
					)}
					<ErrorAlert invalid={invalid} title={'Problem with creating note'} />
					<TextInput
						error={errors.content ? true : false}
						placeholder={errors.content?.message || 'Your note content'}
						withAsterisk
						id="content"
						label="Note content"
						{...register('content')}
						radius="md"
					/>
					<Flex
						mih={20}
						mt={15}
						gap="md"
						justify="flex-start"
						align="flex-start"
						direction="row"
						wrap="wrap"
					>
						<Checkbox
							id="addSource"
							checked={addSource}
							{...register('addSource')}
							onChange={handleAddSource}
							label="Add source"
						/>
					</Flex>
					<Transition
						mounted={addSource}
						transition="fade"
						duration={400}
						timingFunction="ease"
					>
						{(styles) => (
							<div style={styles}>
								<Autocomplete
									label="Source"
									id="source"
									withAsterisk
									data={uniqueSources.map((source) => source.source)}
									value={userSourceInput || ''}
									onChange={(value) => {
										setUserSourceInput(value);
										setValue('source', value);
									}}
									comboboxProps={{
										transitionProps: { transition: 'pop', duration: 200 },
									}}
									error={errors?.source ? true : false}
									placeholder={errors.source?.message || 'Your source here'}
								/>
								<TextInput
									placeholder={'Your additional source information here'}
									id="additionalSourceInformation"
									label="Additional Source Information"
									onChange={(event) => {
										setUserAdditionalSourceInformationInput(
											event.currentTarget.value
										);
										setValue(
											'additionalSourceInformation',
											event.currentTarget.value
										);
									}}
								/>
							</div>
						)}
					</Transition>

					<Box my={15}>
						<TagMultiSelect
							value={selectedTags}
							setValue={setSelectedTags}
							tagData={selectValues}
						/>
					</Box>
					<Button variant="text" type="submit">
						Create Note
					</Button>
				</form>
			</GenericModal>
		</div>
	);
};
