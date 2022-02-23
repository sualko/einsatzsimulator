import { Aid as PureAid } from "@prisma/client";
import BoardGame from ".";
import Aid from "./Aid";
import SanAid from "./Aid/SanAid";

export default class AidFactory {
    private constructor() {

    }

    public static generate(data: PureAid, boardGame: BoardGame): Aid {
        return new SanAid(data, boardGame);
    }
}