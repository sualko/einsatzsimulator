import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

type Props = {
    player: { [userId: string]: { aidId?: number, name: string } },
    ownId: string,
}

const PlayerList: React.FC<Props> = ({ player, ownId }) => {
    return (
        <Stack direction="row" spacing={1}>
            {Object.entries(player).map(([id, player]) =>
                <Chip
                    key={id}
                    avatar={player.name ? <Avatar>{player.name.slice(0, 1)}</Avatar> : <Skeleton variant="circular" />}
                    label={id === ownId ? 'Du' : (player.name ? player.name : <Skeleton width={30} variant="text" />)}
                    variant="outlined"
                />
            )}
        </Stack>
    )
}

export default PlayerList;