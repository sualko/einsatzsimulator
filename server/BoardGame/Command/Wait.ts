import Command, { CommandType } from ".";

export default class Wait extends Command {
    constructor(private duration = 1000) {
       super(CommandType.Wait);
    }

    public getDuration(): number {
        return this.duration;
    }
}