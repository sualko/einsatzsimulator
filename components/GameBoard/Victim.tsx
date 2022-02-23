import { Avatar, Box, ButtonBase, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Priority } from "@prisma/client";
import { VictimState } from 'lib/gameState';
import { TriageColor } from 'lib/triage';
import React, { useState } from 'react';
import TriageTag from "./TriageTag";
import VictimDetails from "./VictimDetails";

type Props = VictimState & {

}

const Victim: React.FC<Props> = (state) => {
    const [isDetailsOpen, setDetailsOpen] = useState(false);
    const [isTriageTagOpen, setTriageTagOpen] = useState(false);

    return (
        <Box>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{float: 'left'}}>
                <IconButton onClick={() => setDetailsOpen(true)}>
                    <Avatar sx={{ width: 56, height: 56, transform: !state.ableToWalk ? 'rotate(90deg);' : '' }} src={`/avatars/00${state.id}.jpeg`}></Avatar>
                </IconButton>
                {state.priority !== Priority.Unknown && (
                    <ButtonBase onClick={() => setTriageTagOpen(true)}>
                        <Box sx={{ marginTop: -2, border: '1px solid #efefef', backgroundColor: '#fff', zIndex: 10 }}>
                            <Box sx={{ minWidth: 40, minHeight: 15 }} display="flex" flexDirection="column">
                                <Typography align="center" fontSize={10}>{state.identifier || ' '}</Typography>
                                <Box sx={{ minWidth: 40, minHeight: 8, backgroundColor: TriageColor[state.priority] }}></Box>
                            </Box>
                        </Box>
                    </ButtonBase>
                )}
            </Box>
            <Box sx={{clear: 'both'}}></Box>
            <Dialog open={isDetailsOpen} onClose={() => setDetailsOpen(false)}>
                    <DialogTitle>Patienten Details</DialogTitle>
                    <DialogContent>
                        <VictimDetails {...state} />
                    </DialogContent>
            </Dialog>
            <Dialog open={isTriageTagOpen} onClose={() => setTriageTagOpen(false)} maxWidth="md">
                    <DialogTitle>Verletztenanhängekarte</DialogTitle>
                    <DialogContent>
                        <TriageTag {...state} />
                    </DialogContent>
            </Dialog>
        </Box>
    )
}

export default Victim;