import { Avatar, Badge, Box, Typography } from "@mui/material";
import { Leader, Qualification } from "@prisma/client";
import React from 'react';
import LeaderBadge from "./LeaderBadge";
import Nameplate from "./Nameplate";
import QualificationBadge from "./QualificationBadge";

type Props = {
    name: string,
    qualification: Qualification,
    leader: Leader,
    playerName?: string,
}

const Aid: React.FC<Props> = ({ name, qualification, leader, playerName }) => {
    return (
        <Box sx={{ width: 66, position: 'relative', margin: 3 }}>
            <Box sx={{ position: 'absolute', bottom: '90%', left: '-4px', right: '-4px', zIndex: 10 }}>
                {playerName && <Typography sx={{fontSize: '0.5rem'}} align="center">({playerName})</Typography>}
                    <Nameplate name={name} size="0.5rem" />
            </Box>
            <Avatar sx={{ width: 56, height: 56, border: '5px solid #ffffff' }}></Avatar>
            <Box sx={{ position: 'absolute', left: '-4px', bottom: '-4px' }}>
                <LeaderBadge leader={leader} size="6px" />
            </Box>
            <Box sx={{ position: 'absolute', right: '-4px', bottom: '-4px' }}>
                <QualificationBadge qualification={qualification} size="24px" />
            </Box>
        </Box >
    )
}

export default Aid;