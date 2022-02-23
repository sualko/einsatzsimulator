import { Aid } from "@prisma/client";
import { Movement, PersonType } from "server/BoardGame/Person";
import { BoardGameEvent } from "./BoardGameEvents";
import { GameState, UserState, VictimState } from "./gameState";

export enum GameEvent {
    UserUpdate = 'USER_UPDATE',
    UserReady = 'USER_READY',
    GetState = 'GET_STATE',
    Command = 'COMMAND',
}

export interface ServerToClientEvents {
    [GameEvent.UserUpdate]: (user: UserState) => void
    [BoardGameEvent.VictimUpdate]: (victim: VictimState) => void
    [BoardGameEvent.AidUpdate]: (aid: Aid) => void
    [BoardGameEvent.Started]: () => void
    [BoardGameEvent.MovementStart]: (personType: PersonType, personId: number, movement: Movement) => void
    [BoardGameEvent.MovementEnd]: (personType: PersonType, personId: number) => void
}

export interface ClientToServerEvents {
    start: () => void
    [GameEvent.GetState]: (callback: (state: GameState) => void) => void
    [GameEvent.UserUpdate]: (name: string, aidId: number | undefined, callback?: (success: boolean) => void) => void
    [GameEvent.UserReady]: () => void
    [GameEvent.Command]: (command: string, callback: (errorMessage: string | false) => void) => void
}

export interface BoardGameEvents extends ServerToClientEvents {
    [BoardGameEvent.VictimNew]: (victim: VictimState) => void
    [BoardGameEvent.AidNew]: (aid: Aid) => void
    [BoardGameEvent.AidBusy]: (aidId: number) => void
    [BoardGameEvent.AidStandby]: (aidId: number) => void
}