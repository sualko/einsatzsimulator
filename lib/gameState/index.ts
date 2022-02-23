import { Aid, Victim, Injury, Location } from "@prisma/client";
import { Action, ActionType } from "./actions";

export enum State { Joining, Ready };

export type UserState = {
  id: string,
  name: string,
  state: State,
  aidId?: number,
}

export type AidState = Aid;

export type InjuryState = Injury;

export type VictimState = Victim & { injuries: InjuryState[] };

export type LocationState = Location & { victims: { [id: number]: VictimState } };

export type GameState = {
  userId: string,
  users: { [userId: string]: UserState },
  started: boolean,
  aids: { [aidId: number]: Aid },
  locations: { [locationId: number]: LocationState }
  walkingPosition: null | { longitude: number, latitude: number }
}

export const initialGameState: GameState = {
  userId: '',
  users: {},
  started: false,
  aids: {},
  locations: {},
  walkingPosition: null,
}

export const gameStateReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case ActionType.init:
      return { ...state, ...action.data };
    case ActionType.started:
      return { ...state, started: true };
    case ActionType.updateAid:
      const aids = { ...state.aids, [action.data.id]: action.data };

      return { ...state, aids };
    case ActionType.updateVictim:
      const victim = action.data;

      if (victim.locationId === null || !state.locations[victim.locationId]) {
        return { ...state };
      }

      const location = { ...state.locations[victim.locationId] };

      location.victims = { ...location.victims, [victim.id]: victim };

      const locations = { ...state.locations, [location.id]: location };

      return { ...state, locations };
    case ActionType.updateUser: {
      const users = { ...state.users, [action.data.id]: action.data };

      return { ...state, users };
    }
    case ActionType.userReady:
      const user = state.userId && state.users[state.userId];

      if (!user) {
        return { ...state };
      }

      const users = { ...state.users, [user.id]: { ...user, state: State.Ready } };

      return { ...state, users };
    case ActionType.updateWalkingPosition:
      if ('longitude' in action && 'latitude' in action) {
        return {
          ...state, walkingPosition: {
            latitude: action.latitude,
            longitude: action.longitude,
          }
        };
      }

      return { ...state, walkingPosition: null };
  }
}

export const gameStateReducerWithLogger = (state: GameState, action: Action): GameState => {
  const next = gameStateReducer(state, action);

  console.group();
  console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", state);
  console.log("%cAction:", "color: #00A7F7; font-weight: 700;", ActionType[action.type], action);
  console.log("%cNext State:", "color: #47B04B; font-weight: 700;", next);
  console.groupEnd();

  return next;
}