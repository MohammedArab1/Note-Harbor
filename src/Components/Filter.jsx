import { Button, Flex, LoadingOverlay, TextInput, Title } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { applyFilter, getUniqueSources } from '../../Utils/Utils';
import { SourceMultiSelect } from '../Components/SourceMultiSelect';
import { TagMultiSelect } from '../Components/TagMultiSelect';
export const Filter = ({
	setNotes,
	containerNotes,
	clearFilterNotes = containerNotes,
}) => {
	const {
		tags,
		// allProjectNotes
	} = useContext(AppDataContext);
	const [selectTags, setSelectTags] = useState([]);
	const [uniqueSources, setUniqueSources] = useState([]);
	const [filterValues, setFilterValues] = useState({
		searchString: '',
		selectedSources: [],
		selectedTags: [],
	});
	const [searching, setSearching] = useState(false);
	useEffect(() => {
		setUniqueSources(getUniqueSources(containerNotes));
	}, [containerNotes]);
	useEffect(() => {
		setSelectTags(
			tags.map((tag) => {
				return {
					value: tag._id,
					label: tag.tagName,
					color: tag.colour,
				};
			})
		);
	}, [tags]);

	return (
		<>
			<Title ta="center" order={2}>
				Filters
			</Title>
			<TextInput
				placeholder={'Your search filter here...'}
				id="searchString"
				label="Search for notes by content"
				radius="md"
				value={filterValues.searchString}
				onChange={(e) => {
					setFilterValues({
						...filterValues,
						searchString: e.target.value,
					});
				}}
			/>
			<SourceMultiSelect
				value={filterValues.selectedSources}
				setValue={(value) => {
					setFilterValues({ ...filterValues, selectedSources: value });
				}}
				sourceData={uniqueSources}
			/>
			<TagMultiSelect
				value={filterValues.selectedTags}
				setValue={(value) => {
					setFilterValues({ ...filterValues, selectedTags: value });
				}}
				tagData={selectTags}
			/>
			<br />
			<Flex
				mih={20}
				mt={15}
				gap="md"
				justify="space-between"
				align="flex-start"
				direction="row"
				wrap="wrap"
			>
				<Button
					onClick={() => {
						setSearching(true);
						setNotes(applyFilter(containerNotes, filterValues));
						setSearching(false);
					}}
				>
					Search
				</Button>
				<Button
					onClick={() => {
						setFilterValues({
							searchString: '',
							selectedSources: [],
							selectedTags: [],
						});
						setNotes(clearFilterNotes);
					}}
				>
					Clear Filters
				</Button>
			</Flex>
			<LoadingOverlay
				visible={searching}
				zIndex={1000}
				overlayProps={{ radius: 'sm', blur: 2 }}
			/>
		</>
	);
};
