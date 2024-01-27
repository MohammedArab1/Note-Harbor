import {
	CheckIcon,
	Combobox,
	Group,
	Input,
	Pill,
	PillsInput,
	useCombobox,
	Text,
	Flex,
	Grid,
	Checkbox,
	ScrollArea
} from '@mantine/core';
import { useState } from 'react';
import { TagOptionPill } from './TagOptionPill';
import {IconCircleFilled, IconCheck} from '@tabler/icons-react';
import classes from '../../styles/TagPill.module.css';

export function TagMultiSelect({value, setValue,tagData}) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
		onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
	});

	const handleValueSelect = (val) => {
		setValue((current) =>
			current.includes(val)
				? current.filter((v) => v !== val)
				: [...current, val]
		);
	}

	const handleValueRemove = (val) =>
		setValue((current) => current.filter((v) => v !== val));
	
	
	const values = value.map((item) => (
		tagData.map((tag) => {
			if (tag.value === item) {
				return (
				<TagOptionPill
				tag={tag}
				key={item}
				value={item}
				onRemove={() => handleValueRemove(item)}
			>
				{item}
			</TagOptionPill>
			)}
		})
		
	));
	const dot = (color = 'transparent') => ({
		'--dot-color': color,
	});

	const options = tagData.map((item) => {
		return (
			<Combobox.Option 
				value={item.value}
				key={item.value}
				active={value.includes(item.value)}
			>
				<Group gap="sm">
				{/* <Flex
					mih={20}
					mt={15}
					gap="md"
					justify="flex-start"
					align="flex-start"
					direction="row"
					wrap="wrap"
					> */}
					{/* {value.includes(item.value) ? <CheckIcon size={12} /> : null} */}
					{/* <Checkbox
						checked={value.includes(item.value)}
						onChange={() => {}}
						aria-hidden
						tabIndex={-1}
						style={{ pointerEvents: 'none' }}
					/> */}
					<span className={classes.dot} style={dot(item.color)}>{item.label}</span>
				{/* </Flex> */}
				</Group>
			</Combobox.Option>
		);
	});

	return (
		<Combobox 
			store={combobox}
			onOptionSubmit={handleValueSelect}
			zIndex={9000}
			withinPortal={true}
			transitionProps={{ duration: 200, transition: 'pop' }}
		>
			<Combobox.DropdownTarget >
				<PillsInput pointer onClick={() => combobox.toggleDropdown()} label="Pick one or many tags" >
					<Pill.Group >
						{values.length > 0 ? (
							values
						) : (
							<Input.Placeholder>Pick one or more values</Input.Placeholder>
						)}

						<Combobox.EventsTarget>
							<PillsInput.Field
								type="hidden"
								onBlur={() => combobox.closeDropdown()}
								onKeyDown={(event) => {
									if (event.key === 'Backspace') {
										event.preventDefault();
										handleValueRemove(value[value.length - 1]);
									}
								}}
							/>
						</Combobox.EventsTarget>
					</Pill.Group>
				</PillsInput>
			</Combobox.DropdownTarget>

			<Combobox.Dropdown mah={200} style={{ overflowY: 'auto' }}>
				<Combobox.Options>{options}</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
}
