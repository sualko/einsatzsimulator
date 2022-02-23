import React, { useEffect, useReducer, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GetServerSideProps } from 'next';
import prisma from 'lib/prisma';
import { Aid, Injury, Location, Match as PureMatch, Scenario, Victim } from '@prisma/client';
import createSocket, { Socket } from 'socket.io-client';
import { BoardGameEvent } from 'lib/BoardGameEvents';
import PlayerList from 'components/PlayerList';
import JoinForm from 'components/JoinForm';
import GameBoard from 'components/GameBoard';
import { GameState, gameStateReducer, initialGameState, UserState, State, gameStateReducerWithLogger } from 'lib/gameState';
import { gameStarted, resetWalkingPosition, setInitialData, updateAid, updateUser, updateVictim, updateWalkingPosition } from 'lib/gameState/actions';
import { ClientToServerEvents, GameEvent, ServerToClientEvents } from 'lib/socket';
import Board from "components/GameBoard/Board";
import { Alert, Paper } from "@mui/material";
import { Movement, PersonType } from "server/BoardGame/Person";
import { calculateCurrentCoordinates } from "lib/helper";
import CopyUrlToClipboard from "components/JoinForm/CopyUrlToClipboard";

type Props = {
  match: PureMatch,
  scenario: Scenario,
  locations: Location[],
}

const Game: React.FC<Props> = ({ scenario, match, locations }) => {
  const [state, dispatch] = useReducer(process.env.NODE_ENV === 'development' ? gameStateReducerWithLogger : gameStateReducer, initialGameState);

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [moveInterval, setMoveInterval] = useState<number>();

  const user = state.userId ? state.users[state.userId] : undefined;

  useEffect(() => {
    console.log('open connection')

    const socket = createSocket({
      query: {
        matchId: match.id,
      }
    });

    setSocket(socket);

    socket.emit(GameEvent.GetState, (data: GameState) => {
      console.log('Initial data received', data)
      dispatch(setInitialData(data));
    });

    socket.on('disconnect', () => {
      socket.close();

      setSocket(undefined);
    });

    return () => {
      console.log('close connection')
      socket.close();

      setSocket(undefined);
    }
  }, [match.id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onUserUpdate = (user: UserState) => {
      dispatch(updateUser(user));
    };

    const onVictimUpdate = (update: Victim & { injuries: Injury[] }) => {
      console.log('onVictimUpdate', update);
      dispatch(updateVictim(update));
    }

    const onAidUpdate = (update: Aid) => {
      console.log('onAidUpdate', update);
      dispatch(updateAid(update));
    }

    const onStarted = () => {
      dispatch(gameStarted());
    }

    socket.on(GameEvent.UserUpdate, onUserUpdate);
    socket.on(BoardGameEvent.VictimUpdate, onVictimUpdate);
    socket.on(BoardGameEvent.AidUpdate, onAidUpdate);
    socket.on(BoardGameEvent.Started, onStarted);

    return () => {
      socket.off(GameEvent.UserUpdate, onUserUpdate);
      socket.off(BoardGameEvent.VictimUpdate, onVictimUpdate);
      socket.off(BoardGameEvent.AidUpdate, onAidUpdate);
      socket.off(BoardGameEvent.Started, onStarted);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onMovementUpdate = (type: PersonType, id: number, movement?: Movement) => {
      if (type !== PersonType.Aid || id !== user?.aidId) {
        return;
      }

      if (typeof moveInterval !== 'undefined') {
        window.clearInterval(moveInterval);
      }

      if (movement) {
        const position = calculateCurrentCoordinates(movement.latitude, movement.longitude, new Date(movement.start), movement.bearing, movement.walkingSpeedInMeters);

        dispatch(updateWalkingPosition(position.latitude, position.longitude));

        setMoveInterval(window.setInterval(() => {
          const position = calculateCurrentCoordinates(movement.latitude, movement.longitude, new Date(movement.start), movement.bearing, movement.walkingSpeedInMeters);

          dispatch(updateWalkingPosition(position.latitude, position.longitude));
        }, 5000));
      } else {
        dispatch(resetWalkingPosition());
      }
    }

    socket.on(BoardGameEvent.MovementStart, onMovementUpdate);
    socket.on(BoardGameEvent.MovementEnd, onMovementUpdate);

    return () => {
      socket.off(BoardGameEvent.MovementStart, onMovementUpdate);
      socket.off(BoardGameEvent.MovementEnd, onMovementUpdate);
    }
  }, [socket, user?.aidId, moveInterval])

  useEffect(() => {
    console.log('useEffect for name')
    if (!socket || !user?.name) {
      return;
    }

    socket.emit(GameEvent.UserUpdate, user.name, user.aidId);
  }, [socket, user?.name, user?.aidId]);

  useEffect(() => {
    if (socket && user?.state === State.Ready) {
      console.log('User is ready. Let it start.');

      socket.emit(GameEvent.UserReady);
    }
  }, [socket, user?.state])

  if (socket && user?.state === State.Ready) {
    return <GameBoard state={state} dispatch={dispatch} socket={socket} scenario={scenario} />;
  }

  return (
    <Board latitude={scenario.latitude} longitude={scenario.longitude}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ padding: 3 }}>
          {!socket && <Alert severity="warning">Keine Verbindung zum Server</Alert>}

          <Box display="flex" justifyContent="flex-end">
            <CopyUrlToClipboard />
          </Box>

          <Typography variant="h5" gutterBottom>Willkommen{user?.name && ', ' + user.name}</Typography>
          <Typography variant="h4" component="h1">
            {scenario.name}
          </Typography>

          {<Box sx={{ marginTop: 8, marginBottom: 5 }}>
            <Typography variant="caption" gutterBottom>Mitspieler:</Typography>
            <PlayerList player={state.users} ownId={state.userId} />
          </Box>}

          {(!socket || !socket.active)
            ?
            <Typography>Connecting...</Typography>
            :
            <JoinForm {...{ state, dispatch, locations, scenario }} />
          }
        </Paper>
      </Container>
    </Board>
  )
}

export default Game;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const matchId = context.params?.matchId?.toString();

  if (!matchId) {
    return {
      notFound: true,
    }
  }

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      scenario: true,
    },
  });

  if (!match) {
    return {
      notFound: true,
    }
  }

  const locations = await prisma.location.findMany({
    where: {
      scenarioId: match.scenarioId,
    }
  });

  const scenario = match.scenario;

  delete (match as any).scenario;

  return {
    props: {
      match: match as PureMatch,
      scenario,
      locations,
    },
  }
}