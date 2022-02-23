import { Box, Container, Stack, Typography } from '@mui/material';
import { Scenario } from "@prisma/client";
import { GameState, UserState } from 'lib/gameState';
import { Action } from 'lib/gameState/actions';
import { ClientToServerEvents, GameEvent, ServerToClientEvents } from "lib/socket";
import SunIcon from '@mui/icons-material/WbSunny';
import EastIcon from '@mui/icons-material/East';
import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Aid from "./Aid";
import Board from "./Board";
import CommandInput from "./CommandInput";
import LocationOverview from './LocationOverview';
import RadioIcon from '@mui/icons-material/Radio';
import PlayerLocation from "./PlayerLocation";
import TemporaryInformation from "./TemporaryInformation";
import Victim from "./Victim";

type Props = {
    state: GameState,
    dispatch: React.Dispatch<Action>,
    socket: Socket<ServerToClientEvents, ClientToServerEvents>,
    scenario: Scenario
}

const GameBoard: React.FC<Props> = ({ state, socket, scenario }) => {

    useEffect(() => {
        socket.emit('start');
    }, [socket]);

    const onCommand = (command: string): Promise<boolean> => {
        return new Promise(resolve => {
            socket.emit(GameEvent.Command, command, (errorMessage) => {

                resolve(!!errorMessage);
            });
        });
    }

    const user = state.users[state.userId];
    const userAid = typeof user.aidId === 'number' ? state.aids[user.aidId] : undefined;
    const userLocation = (userAid && userAid.locationId) ? state.locations[userAid.locationId] : undefined;
    const aidUserMap = Object.values(state.users).reduce<{ [aidId: string]: UserState }>((map, user) => (user.aidId ? { ...map, [user.aidId.toString()]: user } : map), {});

    const playerLocation = state.walkingPosition ?? userLocation;

    if ((!userLocation || !userAid) && !state.walkingPosition) {
        return (
            <Container>
                <Stack spacing={3} direction="row">
                    {Object.values(state.locations).map(location => (
                        <LocationOverview
                            key={location.id}
                            aids={Object.values(state.aids).filter(aid => aid.locationId === location.id)}
                            location={location} />
                    ))}
                </Stack>
            </Container>
        );
    }

    const aids = userLocation ? Object.values(state.aids).filter(aid => aid.locationId === userLocation.id) : [];
    const victims = userLocation ? Object.values(userLocation.victims) : [];

    //@TODO mix victims and aids
    const victimBoxes = victims.map(victim => (<Box key={victim.id} sx={{ flexShrink: 0 }}>
        <Victim {...victim} />

        {aids.filter(aid => aid.victimId === victim.id).map(aid => <Aid key={aid.id} name={aid.name} playerName={aidUserMap[aid.id.toString()]?.name} qualification={aid.qualification} leader={aid.leader} />)}
    </Box>));

    const aidBoxes = aids.filter(aid => aid.victimId === null).map(aid => <Aid key={aid.id} name={aid.name} playerName={aidUserMap[aid.id.toString()]?.name} qualification={aid.qualification} leader={aid.leader} />)

    return (
        <Board latitude={scenario.latitude} longitude={scenario.longitude}>
            <Box display="flex">
                <Box sx={{ minHeight: '100vh' }} display="flex" flexDirection="column">
                    {/* {userAid && <PersonalGear name={userAid.name} leader={userAid.leader} qualification={userAid.qualification} radio={{
                        channel: 39,
                        mode: 0
                    }} />}
                    <PermanentInformation /> */}
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Box p={2} sx={{ minWidth: '264px', minHeight: '68px', color: '#245a6a' }}>
                        <Stack spacing={1} direction="row">
                            <SunIcon sx={{ color: 'yellow' }} />
                            <EastIcon sx={{ transform: 'rotate(-25deg)' }} />
                            <Typography>1 m/s</Typography>
                            <RadioIcon sx={{ color: '#545454' }} />
                        </Stack>
                    </Box>
                </Box>
                <Box sx={{ flexGrow: 1, position: 'relative' }} display="flex" flexDirection="column" justifyContent="center" >
                    <Box display="flex" flexWrap="wrap">
                        {[...victimBoxes, ...aidBoxes].reduce<JSX.Element[]>((stack, box, i) => {
                            return stack.concat([
                                <Box key={i} sx={{ flexShrink: 1, width: Math.round(Math.random() * 100) + '%' }}></Box>,
                                box,
                            ]);
                        }, [])}
                    </Box>

                    <CommandInput sx={{ position: "absolute", bottom: 20, left: 20, right: 20 }} onSubmit={onCommand} />
                </Box>
                <Box display="flex" flexDirection="column" alignItems="end" sx={{ maxWidth: '400px' }}>
                    <TemporaryInformation />

                    <Box sx={{ flexGrow: 1 }}></Box>

                    <Box>
                    {userLocation && <Typography align="center" sx={{ width: '100%', marginBottom: -3, color: '#3c5836' }}>{userLocation.name}</Typography>}
                    {playerLocation && <PlayerLocation latitude={playerLocation.latitude} longitude={playerLocation.longitude} />}
                    </Box>
                </Box>
            </Box>
        </Board>
    )
}

export default GameBoard;