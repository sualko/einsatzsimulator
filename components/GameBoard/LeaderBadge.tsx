import { Box, Stack } from "@mui/material";
import React from 'react';
import StarIcon from "@mui/icons-material/Star";
import { Leader } from "@prisma/client";

const stars = {
    [Leader.None]: 0,
    [Leader.Group]: 2,
    [Leader.Unit]: 4,
    [Leader.Platoon]: 5,
}

type Props = {
    leader: Leader,
    size?: number|string,
}

const LeaderBadge: React.FC<Props> = ({ leader, size }) => {
    size = size || '2.1875rem';

    return (
        <Box sx={{
            backgroundColor: "black",
            borderRadius: '1em',
            border: '0.4em solid blue',
            color: 'blue',
            width: '2em',
            height: '4em',
            fontSize: size,
            overflow: 'hidden',
            boxSizing: 'content-box' }}>
            <Stack direction="column" spacing={0} alignItems="center" justifyContent="flex-end" height="100%">
                {Array.from({ length: stars[leader] }, (_, i) => <StarIcon key={i} fontSize="inherit" />)}
            </Stack>
        </Box>
    )
}

export default LeaderBadge;