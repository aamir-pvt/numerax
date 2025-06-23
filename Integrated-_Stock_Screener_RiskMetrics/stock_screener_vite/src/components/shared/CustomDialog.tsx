import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Grid } from '@mui/material';
import { Padding } from '@mui/icons-material';

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

interface Props {
    openDialog: true,
    handleClose: () => void,
    dialogTitle: string,
    dialogContentText: string,
    dialogConfirmButtonText: string,
    dialongConfirmAction: () => void

}

export default function CustomDialog({ openDialog, handleClose, dialogTitle, dialogContentText, dialogConfirmButtonText, dialongConfirmAction }: Props) {
    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={2} justifyContent="flex-end" sx={{ width: '100%', paddingTop: '2%' }}>
                        <Button autoFocus onClick={handleClose} sx={{ marginRight: '2%', width: '25%', color: 'black' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" sx={{ width: '25%', backgroundColor: 'rgb(51 65 85)', '&:hover': 'rgb(14 165 233)' }} onClick={dialongConfirmAction}>{dialogConfirmButtonText}</Button>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
