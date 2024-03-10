import { CloseButton } from '@mantine/core';
import classes from '../../styles/TagPill.module.css';
import {IconCircleFilled} from '@tabler/icons-react';
import { Text } from '@mantine/core';
export function SourceOptionPill({ sourceText, onRemove, ...others }) {
	return (
		<div className={classes.pill} {...others}>
			<Text fz={'sm'}  className={`${classes.dot} ${classes.label}`}>{sourceText}</Text>
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
