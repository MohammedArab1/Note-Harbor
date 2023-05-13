import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmationPopup = ({ name, message, onConfirm }) => {
const [open, setOpen] = useState(false);

const handleOpen = () => {
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
};

const handleConfirm = () => {
    onConfirm();
    handleClose();
};

return (
    <div>
        <Button variant="text" color="primary" onClick={handleOpen}>
            {name}
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
            <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
    </div>
);
};

export default ConfirmationPopup;
