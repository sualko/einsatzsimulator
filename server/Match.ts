import * as socketio from 'socket.io';
import prisma from "lib/prisma";
import BoardGame from './BoardGame';
import { BoardGameEvent } from 'lib/BoardGameEvents';
import User from './User';
import NLU from "./NLU";

export default class Match {

    public static io: socketio.Server;

    private static matches: { [id: string]: Match } = {};

    public static async get(id: string): Promise<Match> {
        if (!Match.matches[id]) {
            const data = await prisma.match.findUnique({
                where: { id },
            });

            if (data === null) {
                throw new Error('Match not found');
            }

            const boardGame = await BoardGame.load(data.scenarioId);

            Match.matches[id] = new Match(id, boardGame);
        }

        return Match.matches[id];
    }

    private users = new Map<string, User>();

    private nlu = new NLU();

    private constructor(private id: string, private boardGame: BoardGame) {
        for (const eventName of Object.values(BoardGameEvent)) {
            boardGame.on(eventName, (...args) => {
                Match.io.to(this.id).emit(eventName, ...args);
            });
        }
    }

    public getId(): string {
        return this.id;
    }

    public getBoardGame(): BoardGame {
        return this.boardGame;
    }

    public getUsers(): User[] {
        return [...this.users.values()];
    }

    public getNLU(): NLU {
        return this.nlu;
    }

    public join(socket: socketio.Socket) {
        const user = new User(this, socket);

        console.log('Add new user');
        this.users.set(user.getId(), user);

        socket.on('disconnect', reason => this.onDisconnect(user, reason));
        socket.on('connect_error', (err) => {
            console.log(`[${socket.id}] connect_error due to ${err.message}`);
        });
    }


    private onDisconnect = (user: User, reason: string) => {
        console.log(`[${user.getId()}] left the match, because ${reason || 'mimimi'}`);

        const aidId = user.getAidId();

        if (aidId) {
            this.boardGame.getAid(aidId).setPlayedBy(null);
        }

        this.users.delete(user.getId());

        if (this.users.size === 0) {
            //@todo close match
        }
    }
}