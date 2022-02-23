import axios from "axios";
import { CommandType } from "./BoardGame/Command";

const defaultRasaRestEndpoint = 'http://localhost:5005/model/parse';

type RasaParseResponse = {
    entities: {
        start: number,
        end: number,
        value: string,
        entity: string,
        confidence?: number,
    }[],
    intent: {
        confidence: number,
        name: string,
    },
    text: string,
}

export type Intent = {
    type: CommandType,
    entities: {
        [type: string]: string[]
    }
} | {
    type: CommandType.Move,
    entities: {
        audience?: string[],
        target?: string[],
    }
}

const IntentCommandMapper: { [intent: string]: CommandType } = {
    move: CommandType.Move,
}

export default class NLU {
    constructor(private url: string = process.env.NLU_ENDPOINT || defaultRasaRestEndpoint) {

    }

    public async getIntent(text: string): Promise<Intent | false> {
        let parsed: RasaParseResponse;

        try {
            parsed = await this.parse(text);
        } catch (err) {
            console.warn('Could not get intent from rasa', err);

            return false;
        }

        if (!(parsed.intent.name in IntentCommandMapper)) {
            return false;
        }

        return {
            type: IntentCommandMapper[parsed.intent.name],
            entities: parsed.entities.reduce<{ [type: string]: string[] }>((entities, entity) => {
                if (!(entity.entity in entities)) {
                    entities[entity.entity] = [];
                }

                if (!entities[entity.entity].includes(entity.value)) {
                    entities[entity.entity].push(entity.value)
                }

                return entities;
            }, {}),
        }
    }

    private async parse(text: string): Promise<RasaParseResponse> {
        const response = await axios.post<RasaParseResponse>(this.url, { text });

        return response.data;
    }
}