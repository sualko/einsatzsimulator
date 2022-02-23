import { Aid, Injury, Victim } from "@prisma/client";
import { GameState, UserState } from ".";

export enum ActionType { init, started, updateAid, updateVictim, updateUser, userReady, updateWalkingPosition };

type InitialDataAction = {
    type: ActionType.init,
    data: GameState,
};

export const setInitialData = (data: GameState): InitialDataAction => ({
    type: ActionType.init,
    data,
});

type GameStartedAction = {
    type: ActionType.started,
};

export const gameStarted = (): GameStartedAction => ({
    type: ActionType.started,
});

type UpdateAidAction = {
    type: ActionType.updateAid,
    data: Aid,
};

export const updateAid = (data: Aid): UpdateAidAction => ({
    type: ActionType.updateAid,
    data,
});

type UpdateVictimAction = {
    type: ActionType.updateVictim,
    data: Victim & { injuries: Injury[] },
}

export const updateVictim = (data: Victim & { injuries: Injury[] }): UpdateVictimAction => ({
    type: ActionType.updateVictim,
    data,
});

type UpdateUserAction = {
    type: ActionType.updateUser,
    data: UserState,
}

export const updateUser = (data: UserState): UpdateUserAction => ({
    type: ActionType.updateUser,
    data,
});

export const updateUserName = (state: GameState, name: string): UpdateUserAction => {
    const user = state.userId && state.users[state.userId];

    if (!user) {
        throw new Error('User not available');
    }

    return {
        type: ActionType.updateUser,
        data: {...user, name},
    };
}

export const updateAidId = (state: GameState, aidId: number): UpdateUserAction => {
    const user = state.userId && state.users[state.userId];

    if (!user) {
        throw new Error('User not available');
    }

    return {
        type: ActionType.updateUser,
        data: {...user, aidId},
    };
}

type UserReadyAction = {
    type: ActionType.userReady,
}

export const userIsReady = (): UserReadyAction => ({
    type: ActionType.userReady,
});

type UpdateWalkingPositionAction = {
    type: ActionType.updateWalkingPosition,
    latitude: number,
    longitude: number,
} | {
    type: ActionType.updateWalkingPosition,
}

export const updateWalkingPosition = (latitude: number, longitude: number): UpdateWalkingPositionAction => ({
    type: ActionType.updateWalkingPosition,
    latitude,
    longitude,
});

export const resetWalkingPosition = (): UpdateWalkingPositionAction => ({
    type: ActionType.updateWalkingPosition,
});

export type Action = InitialDataAction | GameStartedAction | UpdateAidAction | UpdateVictimAction | UpdateUserAction | UserReadyAction | UpdateWalkingPositionAction;