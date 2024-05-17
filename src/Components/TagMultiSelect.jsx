import {
	Combobox,
	Group,
	Input,
	Pill,
	PillsInput,
	useCombobox,
} from '@mantine/core';
import classes from '../../styles/TagPill.module.css';
import { TagOptionPill } from './TagOptionPill';

export function TagMultiSelect({ value, setValue, tagData }) {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
		onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
	});

	const handleValueSelect = (val) => {
		value.includes(val)
			? setValue(value.filter((v) => v !== val))
			: setValue([...value, val]);
	};

	const handleValueRemove = (val) => setValue(value.filter((v) => v !== val));

	const values = value.map((item) =>
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
				);
			}
		})
	);
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
					<span className={classes.dot} style={dot(item.color)}>
						{item.label}
					</span>
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
			<Combobox.DropdownTarget>
				<PillsInput
					pointer
					onClick={() => combobox.toggleDropdown()}
					label="Pick one or many tags"
				>
					<Pill.Group>
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
