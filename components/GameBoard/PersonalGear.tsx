import { Box, MenuItem, Stack, TextField } from "@mui/material";
import { Leader, Qualification } from "@prisma/client";
import React from 'react';
import LeaderBadge from "./LeaderBadge";
import Nameplate from "./Nameplate";
import QualificationBadge from "./QualificationBadge";

enum RadioMode {
    GU,
    GO,
    WU,
    WO,
}

type Props = {
    name: string,
    leader: Leader,
    qualification: Qualification,
    radio: {
        channel: number,
        mode: RadioMode,
    },
    onRadioChange?: (channel: number, mode: RadioMode) => void,
};

const PersonalGear: React.FC<Props> = ({ name, leader, qualification, radio, onRadioChange }) => {
    return (
        <Box sx={{ maxWidth: '100%', width: 400, backgroundColor: '#ff7600' }} p={2}>
            <Box mb={3}>
               <Nameplate name={name} />
            </Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <LeaderBadge leader={leader} size="24px" />
                <QualificationBadge qualification={qualification} />
            </Box>
            <Stack direction="row" spacing={1}>
                <TextField
                    value={radio.channel}
                    label="Kanal"
                    type="number"
                    size="small"
                    sx={{ flexGrow: 1 }}
                    onChange={(ev) => onRadioChange && onRadioChange(parseInt(ev.target.value, 10), radio.mode) } />
                <TextField
                    label="Band"
                    value={radio.mode}
                    size="small"
                    onChange={(ev) => onRadioChange && onRadioChange(radio.channel, parseInt(ev.target.value, 10))}
                    select>
                    <MenuItem value={RadioMode.GU}>GU</MenuItem>
                    <MenuItem value={RadioMode.GO}>GO</MenuItem>
                    <MenuItem value={RadioMode.WU}>WU</MenuItem>
                    <MenuItem value={RadioMode.WO}>WO</MenuItem>
                </TextField>
            </Stack>
        </Box>
    )
}

export default PersonalGear;