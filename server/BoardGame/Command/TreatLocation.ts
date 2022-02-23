import Command, { CommandType } from ".";
import { TreatLevel, TreatOrder } from "../Aid";
import Location from "../Location";

export default class TreatLocation extends Command {
    constructor(private location: Location, private order: TreatOrder, private level: TreatLevel) {
       super(CommandType.TreatLocation);
    }

    public getLocation(): Location {
        return this.location;
    }

    public getTreatOrder(): TreatOrder {
        return this.order;
    }

    public getTreatLevel(): TreatLevel {
        return this.level;
    }
}