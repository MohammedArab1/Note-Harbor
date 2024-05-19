import { CloseButton, Text } from '@mantine/core';
import classes from '../../styles/TagPill.module.css';
export function SourceOptionPill({ sourceText, onRemove, ...others }) {
	return (
		<div className={classes.pill} {...others}>
			<Text fz={'sm'} className={`${classes.label}`}>
				{sourceText}
			</Text>
			<CloseButton
				onMouseDown={onRemove}
				variant="transparent"
				color="gray"
				size={22}
				iconSize={14}
				tabIndex={-1}
			/>
		</div>
	);
}
