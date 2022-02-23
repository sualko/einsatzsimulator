import * as socketio from 'socket.io';
import crypto from 'crypto';
import Match from './Match';
import { ClientToServerEvents, GameEvent, ServerToClientEvents } from 'lib/socket';
import { GameState, initialGameState, LocationState, State, UserState, VictimState } from 'lib/gameState';
import Aid from "./BoardGame/Aid";
import IntentMapper from "./IntentMapper";

const sha1hex = (value: string): string => {
    const hash = crypto.createHash('sha1')
    hash.update(value)

    return hash.digest('hex');
}

export default class User {
    private id: string;

    private aidId?: number;

    private state = State.Joining;

    private name = '';

    private intentMapper: IntentMapper;

    constructor(private match: Match, private socket: socketio.Socket<ClientToServerEvents, ServerToClientEvents>) {
        this.id = sha1hex(socket.id);

        this.intentMapper = new IntentMapper(match.getBoardGame());

        socket.join(match.getId());

        socket.on(GameEvent.GetState, this.onInitialData);
        socket.on(GameEvent.UserUpdate, this.onName);
        socket.on(GameEvent.UserReady, this.onReady);
        socket.on(GameEvent.Command, this.onCommand);
    }

    public getId(): string {
        return this.id;
    }

    public getAidId(): number | undefined {
        return this.aidId;
    }

    public getAid(): Aid | undefined {
        if (typeof this.aidId === 'number') {
            return this.match.getBoardGame().getAid(this.aidId);
        }

        return undefined;
    }

    public getState(): UserState {
        return {
            id: this.id,
            name: this.name,
            state: this.state,
            aidId: this.aidId,
        };
    }

    private onInitialData = (callback: (data: GameState) => void) => {
        console.log('initial data requested');
        const boardGame = this.match.getBoardGame();
        const users = this.match.getUsers().map(user => [user.getId(), user.getState()]);
        const aids = boardGame.getAids().map(aid => [aid.getId(), aid.getData()]);
        const locations = boardGame.getLocations().map<[number, LocationState]>(location => {
            const victims = boardGame.getVictims()
                .filter(victim => victim.getLocationId() === location.getId())
                .map<[number, VictimState]>(victim => [victim.getId(), victim.getState()]);

            return [location.getId(), {
                ...location.getData(),
                victims: Object.fromEntries(victims),
            }];
        });

        console.log(users, this.match.getUsers());

        callback({
            ...initialGameState,
            userId: this.id,
            users: Object.fromEntries(users),
            started: boardGame.hasStarted(),
            aids: Object.fromEntries(aids),
            locations: Object.fromEntries(locations),
        });
    }

    private onName = async (name: string, aidId: number | undefined, callback?: (success: boolean) => void) => {
        //@todo validate name, aidId;
        console.log('onName', name, aidId);

        const boardGame = this.match.getBoardGame();

        if (typeof this.aidId === 'number') {
            boardGame.getAid(this.aidId)?.setPlayedBy(null);
        }

        if (aidId) {
            boardGame.getAid(aidId)?.setPlayedBy(this.getId());
        }

        this.name = name;
        this.aidId = aidId;

        this.socket.to(this.match.getId()).emit(GameEvent.UserUpdate, this.getState());
        this.socket.emit(GameEvent.UserUpdate, this.getState());

        callback && callback(true);
    }

    private onReady = async () => {
        const boardGame = this.match.getBoardGame();

        boardGame.start();
    }

    private onCommand = async (text: string, callback: (errorMessage: string | false) => void) => {
        const aid = this.getAid();

        if (!aid) {
            callback('No aid selected');
            return;
        }

        const intent = await this.match.getNLU().getIntent(text);

        console.log('intent', intent)

        if (!intent) {
            callback('Intent not recognized');
            return;
        }

        const audienceNames = (intent.entities.audience || []).map(name => name.toLowerCase());
        const aids = this.match
            .getBoardGame()
            .getAids(aid.getLocation()?.getId())
            .filter(aid => audienceNames.includes(aid.getName().toLowerCase())); // use levenshtein distance

        if (audienceNames.length !== aids.length) {
            callback('Ambiguous audience');
            return;
        }

        try {
            const command = this.intentMapper.toCommand(intent);

            if (aids.length > 0) {
                aids.forEach(aid => aid.communicate(command));
            } else if (audienceNames.length === 0) {
                this.getAid()?.communicate(command);
            }

            callback(false);
        } catch (err) {
            console.log('Could not execute command', err);

            callback('Command could not be executed: ' + err);
        }
    }
}