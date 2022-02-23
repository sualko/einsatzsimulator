import { Aid as PureAid, Leader } from "@prisma/client";
import { BoardGameEvent } from "../../../lib/BoardGameEvents";
import BoardGame from "..";
import Person, { PersonType } from "../Person";
import Victim from "../Victim"
import Location from "../Location";
import Injury from "../Injury";

// todo: Aid interface for different behavior
// todo: Unit tests
// todo: Functional tests

export enum TreatLevel { Minimum, Lifesaving, Complete };
export enum TreatOrder { Severe, Random }

export default abstract class Aid extends Person<PureAid> {
    private victims: { [id: number]: Victim } = {};

    protected busy = false;

    constructor(protected data: PureAid, boardGame: BoardGame) {
        super(data, boardGame);

        boardGame.emit(BoardGameEvent.AidNew, this.getData());
    }

    protected getType(): PersonType {
        return PersonType.Aid;
    }

    protected flagBusy(): void {
        this.boardGame.emit(BoardGameEvent.AidBusy, this.getId());

        this.busy = true;
    }

    protected clearBusy(): void {
        this.boardGame.emit(BoardGameEvent.AidStandby, this.getId());

        this.busy = false;
    }

    public isBusy(): boolean {
        return this.busy;
    }

    public getData(): PureAid {
        return this.data;
    }

    public setPlayedBy(identifier: string | null) {
        if (this.data.leader === Leader.None) {
            throw new Error('Only leaders can be controlled');
        }

        this.data.playedBy = identifier;

        this.boardGame.emit(BoardGameEvent.AidUpdate, this.getData());
    }

    public getPlayedBy(): string | null {
        return this.data.playedBy;
    }

    protected abstract treatLocation(location: Location, order: TreatOrder, level: TreatLevel): Promise<boolean>;
    protected abstract treatPerson(victim: Victim, level: TreatLevel): Promise<boolean>;
    protected abstract treatInjury(injury: Injury): Promise<boolean>;

    protected goTo(location: Location): Promise<number | null> {
        if (this.isBusy()) {
            throw new Error('Aid is busy and can not move');
        }

        this.leaveAllVictims();

        return super.goTo(location);
    }

    public assignVictim(victim: Victim): void {
        if (!this.victims[victim.getId()]) {
            this.victims[victim.getId()] = victim;
        }
    }


    // discharge?
    public leaveVictim(victim: Victim): void {
        delete this.victims[victim.getId()];
    }

    public leaveAllVictims(): void {
        if (this.isBusy()) {
            throw new Error('Aid is busy and can not leave patients');
        }

        for (const victim of Object.values(this.victims)) {
            this.leaveVictim(victim);
        }
    }
}