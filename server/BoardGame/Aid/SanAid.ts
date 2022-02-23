import { Aid as PureAid } from "@prisma/client";
import Aid, { TreatLevel, TreatOrder } from ".";
import BoardGame from "..";
import { CommandType } from "../Command";
import TreatLocation from "../Command/TreatLocation";
import TreatPerson from "../Command/TreatPerson";
import Injury from "../Injury";
import Location from "../Location";
import Victim from "../Victim";



export default class SanAid extends Aid {

    constructor(data: PureAid, boardGame: BoardGame) {
        super(data, boardGame);

        this.commandActions[CommandType.TreatLocation] = this.processTreatLocationCommand;
        this.commandActions[CommandType.TreatPerson] = this.processTreatPersonCommand;
    }

    protected async treatLocation(location: Location, order: TreatOrder, level: TreatLevel = TreatLevel.Lifesaving): Promise<boolean> {
        if (this.isBusy()) {
            throw new Error('I am currently busy and can not treat a new location');
        }

        const victim = order === TreatOrder.Severe ? this.getMostUrgentVictim(location) : this.getNextVictim(location);

        if (!victim) {
            return true;
        }

        return this.treatPerson(victim, level);
    }

    private getNextVictim(location: Location): Victim | null {
        const victims = this.boardGame?.getVictims(location.getId()) || [];

        return victims.length > 0 ? victims[0] : null;
    }

    private getMostUrgentVictim(location: Location): Victim | null {
        const victims = this.boardGame?.getVictims(location.getId()) || [];

        let mostUrgentVictim: Victim | null = null;

        for (const victim of victims) {
            if (victim.getLocationId() === location.getId() &&
                victim.needsTreatment() &&
                (!mostUrgentVictim || victim.getSeverity() > mostUrgentVictim.getSeverity())) {
                mostUrgentVictim = victim;
            }
        }

        return mostUrgentVictim;
    }

    protected async treatPerson(victim: Victim, level: TreatLevel) {
        if (this.isBusy()) {
            throw new Error('I am busy at the moment and can not treat that person');
        }

        await this.treatNextInjury(victim, level);

        console.log(`[A${this.getId()}] ${this.getName()} treated all doable injuries of ${victim.getName()}\n${victim}`);

        return !victim.needsTreatment();
    }

    private async treatNextInjury(victim: Victim, level: TreatLevel): Promise<void> {
        if (this.hasPendingAbort()) {
            return;
        }

        const injury = victim.getNextInjuryWithHighestSeverity();

        if (injury && (level === TreatLevel.Complete || injury.getSeverity() > 5)) {
            await this.treatInjury(injury);

            return this.treatNextInjury(victim, level);
        }
    }

    protected async treatInjury(injury: Injury): Promise<boolean> {
        if (this.isBusy()) {
            throw new Error('I am busy at the moment and can not treat that injury');
        }

        console.log(`[A${this.getId()}] ${this.getName()} is treating: ${injury}`);

        if (injury.isTreated()) {
            return true;
        }

        this.flagBusy();

        let result = false;

        try {
            result = await injury.treat(this);

            console.log(`[A${this.getId()}] ${this.getName()} finished treatment: ${injury}`);
        } catch (err) {
            console.log(`[A${this.getId()}] Error while treating injury`, err);
        }

        this.clearBusy();

        return result;
    }

    protected processTreatLocationCommand = async (command: TreatLocation): Promise<void> => {
        const location = command.getLocation();
        const order = command.getTreatOrder();
        const level = command.getTreatLevel();

        await this.treatLocation(location, order, level);

        if (this.commands.length === 0) {
            this.commands.unshift({ command });
        }

        return new Promise(resolve => {
            setTimeout(resolve, 3000);
        });
    }

    protected processTreatPersonCommand = async (command: TreatPerson): Promise<void> => {
        const victim = command.getVictim();
        const level = command.getTreatLevel();

        await this.treatPerson(victim, level);

        if (this.commands.length === 0) {
            this.commands.unshift({ command });
        }

        return new Promise(resolve => {
            setTimeout(resolve, 3000);
        });
    }
}