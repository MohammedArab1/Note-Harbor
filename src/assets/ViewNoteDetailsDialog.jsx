import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useState } from 'react';

const ViewNoteDetailsDialog = ({
	name,
	noteContent,
	noteCreatedBy,
	noteDateCreated,
	noteSources,
}) => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant="text" color="primary" onClick={handleOpen}>
				{name}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Note Details</DialogTitle>
				<DialogContent>
					<DialogContentText>Note Content: {noteContent}</DialogContentText>
					<DialogContentText>Note Creator: {noteCreatedBy}</DialogContentText>
					<DialogContentText>
						Note Date Created: {noteDateCreated}
					</DialogContentText>
					<DialogContentText>Note sources: </DialogContentText>
					<ol>
						{noteSources.map((source, i) => {
							return (
								<li key={i}>
									<p>source name: {source.source}</p>
									<p>
										source additional information:{' '}
										{source.additionalSourceInformation}
									</p>
								</li>
							);
						})}
					</ol>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ViewNoteDetailsDialog;
