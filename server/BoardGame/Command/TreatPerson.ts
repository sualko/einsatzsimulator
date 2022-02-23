import Command, { CommandType } from ".";
import { TreatLevel } from "../Aid";
import Victim from "../Victim";

export default class TreatPerson extends Command {
    constructor(private victim: Victim, private level: TreatLevel) {
       super(CommandType.TreatPerson);
    }

    public getVictim(): Victim {
        return this.victim;
    }

    public getTreatLevel(): TreatLevel {
        return this.level;
    }
}