
export interface ICommand {
    getCreationDate(): Date;

    getType(): CommandType;
}

export enum CommandType {
    Move,   // to location, with item (item could be a message)
    TreatLocation, // specific person, people at location (with highest severity)
    TreatPerson,
    Get,    // item: Two Move commands
    Inform, // (shortcut for move)
    Wait,   // (at location)
}

export default abstract class Command implements ICommand {
    protected creationDate = new Date();

    constructor(protected type: CommandType) {

    }

    public getCreationDate(): Date {
        return this.creationDate;
    }

    public getType(): CommandType {
        return this.type;
    }
}