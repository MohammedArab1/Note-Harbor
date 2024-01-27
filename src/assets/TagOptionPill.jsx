import { CloseButton } from '@mantine/core';
import classes from '../../styles/TagPill.module.css';
import {IconCircleFilled} from '@tabler/icons-react';
import { Text } from '@mantine/core';
export function TagOptionPill({ tag, onRemove, ...others }) {
    const dot = (color = 'transparent') => ({
		'--dot-color': color,
	});
	return (
		<div className={classes.pill} {...others}>
			<Text fz={'sm'} style={dot(tag.color)} className={`${classes.dot} ${classes.label}`}>{tag?.label}</Text>
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
