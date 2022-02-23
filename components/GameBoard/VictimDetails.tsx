import React from 'react';
import { VictimState } from "lib/gameState";
import { Avatar, Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import SubmitIcon from "@mui/icons-material/Send"

type Props = VictimState & {

}

const VictimDetails: React.FC<Props> = (state) => {
    const injuries = state.injuries.filter(injury => injury.enabled);

    const onSubmit: React.FormEventHandler = (ev) => {
        ev.preventDefault();
    }

    return (
        <Box sx={{ maxWidth: '580px' }}>
            <Stack direction="column" spacing={1} alignItems="center" mb={3}>
                <Avatar sx={{ width: 120, height: 120, transform: !state.ableToWalk ? 'rotate(90deg);' : '' }} src={`/avatars/00${state.id}.jpeg`}></Avatar>
                <Typography variant="caption">{state.ableToWalk ? 'steht' : 'liegt'}</Typography>
            </Stack>

            {injuries.length > 0 && <>
                <Typography variant="h6" gutterBottom={true}>Sichtbare Verletzungen</Typography>
                <Stack direction="column" spacing={1} mb={3}>
                    {injuries.map(injury => (
                        <Typography key={injury.id}>{injury.severity}, {injury.bodyLocation}, {injury.description}, {injury.treated ? 'behandelt' : 'unbehandelt'}</Typography>
                    ))}
                </Stack>
            </>}

            <form {...onSubmit}>
                <Box display="flex">
                    <TextField size="small" sx={{ flexGrow: 1 }} label="Aktion" />
                    <IconButton type="submit" color="primary">
                        <SubmitIcon />
                    </IconButton>
                </Box>
            </form>
        </Box>
    )
}

export default VictimDetails;