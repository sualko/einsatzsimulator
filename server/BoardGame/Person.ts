import { BoardGameEvent } from "../../lib/BoardGameEvents";
import BoardGame from ".";
import Command, { CommandType } from "./Command";
import Move from "./Command/Move";
import Location from "./Location";
import Wait from "./Command/Wait";
import Aid from "./Aid";
import Victim from "./Victim";
import { sleep } from "lib/helper";

type PersonData = {
    id: number,
    name: string,
    locationId: number | null,
}

export type Movement = {
    longitude: number,
    latitude: number,
    start: Date,
    walkingSpeedInMeters: number,
    bearing: number,
}

export enum PersonType { Aid, Victim };

export default abstract class Person<Data extends PersonData = PersonData> {
    private abortResolves: (() => void)[] = [];

    protected commands: { command: Command, resolve?: (executed: boolean) => void }[] = [];

    protected executingCommand?: Command;

    protected working: boolean = false;

    protected item?: unknown;

    protected commandActions: { [type in CommandType]?: (command: any) => Promise<void> } = {};

    protected started = false;

    constructor(protected data: Data, protected boardGame: BoardGame) {
        this.commandActions[CommandType.Move] = this.processMoveCommand;
        this.commandActions[CommandType.Wait] = (command: Wait) => new Promise(resolve => {
            console.log('I am waiting...');
            setTimeout(resolve, command.getDuration());
        });
    }

    public start(): void {
        this.started = true;
    }

    protected abstract getType(): PersonType;
    public abstract getData(): any;

    public isAid(): this is Aid {
        return this.getType() === PersonType.Aid;
    }

    public isVictim(): this is Victim {
        return this.getType() === PersonType.Victim;
    }

    public getId(): number {
        return this.data.id;
    }

    public getName(): string {
        return this.data.name;
    }

    public getLocation(): Location | undefined {
        const locationId = this.getLocationId();

        return typeof locationId === 'number' ? this.boardGame.getLocation(locationId) : undefined;
    }

    public getLocationId(): number | null {
        return this.data.locationId;
    }

    public carry(item: unknown) {
        this.item = item;
    }

    public isWorking(): boolean {
        return this.working;
    }

    protected setWorking(working: boolean) {
        this.working = working;
    }

    protected async goTo(location: Location): Promise<number | null> {
        const locationId = location.getId();

        if (locationId === this.data.locationId) {
            return this.data.locationId;
        }

        const currentLocation = this.data.locationId ? this.boardGame.getLocation(this.data.locationId) : undefined;
        const distance = currentLocation ? currentLocation.getDistanceToInMeters(location) : 500;
        const walkingTime = distance / this.getWalkingSpeedInMeters();

        console.log(`${this.data.name} got order to move to ${locationId}. It will take ${walkingTime} seconds.`);

        this.data.locationId = null;

        if (currentLocation) {
            const movement = {
                latitude: currentLocation.getLatitude(),
                longitude: currentLocation.getLongitude(),
                start: new Date(),
                bearing: currentLocation.getBearingInDegrees(location),
                walkingSpeedInMeters: this.getWalkingSpeedInMeters(),
            };

            this.boardGame.emit(BoardGameEvent.MovementStart, this.getType(), this.getId(), movement);
        }

        this.emitCurrentData();

        await sleep(walkingTime * 1000);

        this.data.locationId = locationId;

        this.emitCurrentData();

        if (currentLocation) {
            this.boardGame.emit(BoardGameEvent.MovementEnd, this.getType(), this.getId());
        }

        console.log(`${this.data.name} arrived at location ${this.data.locationId}`);

        return locationId;
    }

    protected emitCurrentData() {
        if (this.isVictim()) {
            this.boardGame.emit(BoardGameEvent.VictimUpdate, this.getState());
        } else if (this.isAid()) {
            this.boardGame.emit(BoardGameEvent.AidUpdate, this.getData() as any);
        }
    }

    protected getWalkingSpeedInMeters(): number {
        return 1.5;
    }

    public async communicate(command: Command, force: boolean = true): Promise<boolean> {
        console.log('Received new command', force);
        if (force) {
            this.abort();

            this.clearCommands();
        }

        const promise = new Promise<boolean>(resolve => {
            this.commands.push({ command, resolve });
        });

        this.processCommand();

        return promise;
    }

    protected clearCommands(): void {
        this.commands.forEach(cmd => cmd.resolve?.call(this, false));

        this.commands = [];
    }

    public getPendingWorkload(): number {
        return this.commands.length;
    }

    public getExecutingCommand(): Command | undefined {
        return this.executingCommand;
    }

    protected abort(): Promise<void> {
        if (this.commands.length === 0 && !this.executingCommand) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this.abortResolves.push(resolve);
        });
    }

    protected resolveAbort() {
        this.abortResolves.forEach(resolve => resolve());

        this.abortResolves = [];
    }

    protected hasPendingAbort(): boolean {
        return this.abortResolves.length > 0;
    }

    protected async processCommand(): Promise<void> {
        if (this.isWorking()) {
            return;
        }

        const cmd = this.commands.shift();

        if (!cmd) {
            return;
        }

        this.setWorking(true);

        this.executingCommand = cmd.command;

        console.log(`${this.data.name} is executing ${CommandType[cmd.command.getType()]}`);

        await this.commandActions[cmd.command.getType()]?.call(this, cmd.command);

        this.executingCommand = undefined;

        this.setWorking(false);

        cmd.resolve?.call(this, true);

        if (this.hasPendingAbort()) {
            this.resolveAbort();
        }

        return this.processCommand();
    }

    protected processMoveCommand = async (command: Move): Promise<void> => {
        const location = command.getTargetLocation();

        await this.goTo(location);
    }
}