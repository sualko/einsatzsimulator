import Command, { CommandType } from ".";
import Location from "../Location";

export default class Move extends Command {
    constructor(private location: Location, private item?: unknown) {
       super(CommandType.Move);
    }

    public getTargetLocation(): Location {
        return this.location;
    }

    public getItem(): unknown {
        return this.item;
    }
}