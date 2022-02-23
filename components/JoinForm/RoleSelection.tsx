import { Aid, Leader } from '@prisma/client';
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FaceIcon from '@mui/icons-material/Face';
import { Box, Button } from '@mui/material';

type Props = {
    userId: string,
    characterId?: number,
    setCharacterId: (id: number) => void,
    aids: Aid[],
    player: { [userId: string]: { aidId?: number, name: string } },
    goBack: () => void,
}

const RoleSelection: React.FC<Props> = ({ aids, userId, characterId, setCharacterId, player, goBack }) => {
    const [selectedId, setSelectedId] = useState(characterId);

    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {aids.map(aid => {
                    return (
                        <ListItemButton
                            key={aid.id}
                            onClick={() => setSelectedId(aid.id)}
                            selected={aid.id === selectedId}
                            disabled={aid.leader === Leader.None || (!!aid.playedBy && aid.playedBy !== userId)}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <FaceIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${aid.name} (${aid.age})`}
                                secondary={aid.playedBy ? `Played by ${player[aid.playedBy]?.name}` : `${aid.qualification}, ${aid.leader}`}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
            <Box sx={{ mb: 2 }}>
                <div>
                    <Button
                        variant="contained"
                        disabled={typeof selectedId !== 'number'}
                        onClick={() => typeof selectedId === 'number' && setCharacterId(selectedId)}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Weiter
                    </Button>
                    <Button
                        onClick={goBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Zurück
                    </Button>
                </div>
            </Box>
        </>
    )
}

export default RoleSelection;