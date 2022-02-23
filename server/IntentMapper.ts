import BoardGame from "./BoardGame";
import Command, { CommandType } from "./BoardGame/Command";
import Move from "./BoardGame/Command/Move";
import { Intent } from "./NLU";


export default class IntentMapper {
    constructor(private boardGame: BoardGame) {

    }

    public toCommand(intent: Intent): Command {
        if (intent.type === CommandType.Move) {
            if (intent.entities.target?.length !== 1) {
                throw new Error('Target location is ambiguous');
            }

            const locationName = intent.entities.target[0];
            const location = this.boardGame.getLocationByName(locationName);

            if (!location) {
                throw new Error('Target location is unknown');
            }

            return new Move(location);
        }

        throw new Error('Intent not known');
    }
}