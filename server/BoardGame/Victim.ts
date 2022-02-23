import { Event, Injury as PureInjury, Victim as PureVictim, Consciousness, Pupils  } from ".prisma/client";
import { BoardGameEvent } from "../../lib/BoardGameEvents";
import BoardGame from ".";
import Person, { PersonType } from "./Person";
import Aid from "./Aid";
import Injury from "./Injury";
import Location from "./Location";
import { VictimState } from "lib/gameState";

type VictimEvent = Event & { dependencies: PureInjury[], consequences: PureInjury[] };
export type VictimData = PureVictim & { events: VictimEvent[], injuries: PureInjury[] };

const eventProperties: ['ableToWalk', 'consciousness', 'pupils', 'pupilReaction', 'breathing'] = ['ableToWalk', 'consciousness', 'pupils', 'pupilReaction', 'breathing'];

export default class Victim extends Person<VictimData> {

    private injuries: { [id: number]: Injury } = {};

    constructor(data: VictimData, boardGame: BoardGame) {
        super(data, boardGame);

        for (const injury of data.injuries) {
            this.injuries[injury.id] = new Injury(injury);
        }

        this.boardGame.emit(BoardGameEvent.VictimNew, this.getState());
    }

    public start(): void {
        if (this.started) {
            return;
        }

        super.start();

        for (const event of this.data.events) {
            this.armVictimEvent(event);
        }
    }

    public getLevelOfTreatment(): number {
        let numberOfInjuries = 0;
        let numberOfTreatedInjuries = 0;

        for (const injury of Object.values(this.injuries)) {
            if (injury.isEnabled() ) {
                numberOfInjuries++;

                if (injury.isTreated()) {
                    numberOfTreatedInjuries++;
                }
            }
        }

        return numberOfInjuries > 0 ? numberOfTreatedInjuries / numberOfInjuries : 1;
    }

    protected getType(): PersonType {
        return PersonType.Victim;
    }

    public getData() {
        const data: PureVictim & {events?: any, injuries?: any} = {...this.data};

        delete data.events;
        delete data.injuries;

        return data as PureVictim;
    }

    public getState(): VictimState {
        return {
            ...this.getData(),
            injuries: Object.values(this.injuries).map(injury => injury.getState()),
        }
    }

    public isAbleToWalk(): boolean {
        return this.data.ableToWalk;
    }

    public getConsciousness(): Consciousness {
        return this.data.consciousness;
    }

    public getPupils(): Pupils {
        return this.data.pupils;
    }

    public arePupilsReacting(): boolean {
        return this.data.pupilReaction;
    }

    public getBreathingFrequenz(): number {
        return this.data.breathing;
    }

    public getSeverity(): number {
        let maxSeverity = 0;

        for(const injury of Object.values(this.injuries)) {
            if (injury.getSeverity() > maxSeverity) {
                maxSeverity = injury.getSeverity();
            }
        }

        return maxSeverity;
    }

    public goTo(location: Location): Promise<number | null> {
        if (!this.isAbleToWalk()) {
            throw new Error('Victim is not able to walk');
        }

        return super.goTo(location);
    }

    public getInjuryById(id: number): Injury {
        return this.injuries[id];
    }

    public needsTreatment(): boolean {
        for (const injury of Object.values(this.injuries)) {
            if (injury.isEnabled() && !injury.isTreated()) {
                return true;
            }
        }

        return false;
    }

    public isTreatableBy(aid: Aid): boolean {
        return this.getLocationId() !== null &&
            aid.getLocationId() !== null &&
            this.getLocationId() === aid.getLocationId() &&
            !aid.isBusy();
    }

    public getNextInjuryWithHighestSeverity(): Injury | null {
        const injuries = Object.values(this.injuries);

        if (injuries.length === 0) {
            return null;
        }

        let candidate: Injury | null = null;

        for (const injury of injuries) {
            if (!injury.isDoable()) {
                continue;
            }

            if (!candidate || injury.getSeverity() > candidate.getSeverity()) {
                candidate = injury;
            }
        }

        return candidate;
    }

    private armVictimEvent(event: VictimEvent): void {
        console.log(`[V${this.data.id}] Arm event ${event.id} for ${this.data.name}. Scheduled in ${event.time} minutes.`);

        setTimeout(() => {
            console.log(`[V${this.data.id}] Execute event ${event.id} for ${this.data.name}`);

            let everythingTreated = true;

            for (const dependency of event.dependencies) {
                const injury = this.getInjuryById(dependency.id);

                !injury.isTreated() && (everythingTreated = false);
            }

            if (everythingTreated && event.dependencies.length > 0) {
                return;
            }

            let hasChanges = false;

            for (const consequence of event.consequences) {
                this.getInjuryById(consequence.id).enable();

                hasChanges = true;
            }

            hasChanges = this.updateProperties(event) || hasChanges;

            if (hasChanges) {
                console.log(`[V${this.data.id}] Properties have changed for ${this.data.name}`, this.getData());

                this.boardGame.emit(BoardGameEvent.VictimUpdate, this.getState());
            }

        }, event.time * 60 * 1000);
    }

    private updateProperties(event: VictimEvent): boolean {
        let hasChanges = false;

        for (const property of eventProperties) {
            if (event[property] !== null) {
                if (event[property] !== this.data[property] as any) {
                    hasChanges = true;
                }

                (this.data[property] as any) = event[property];
            }
        }

        return hasChanges;
    }

    public toString(): string {
        let output = `[V${this.getId()}] ${this.getName()}, ${this.data.age}, ${this.isAbleToWalk() ? 'can walk' : 'is not able to walk'}, ${Math.round(this.getLevelOfTreatment() * 10000)/100}%\n`;

        for (const injury of Object.values(this.injuries)) {
            output += `\t${injury}\n`;
        }

        return output;
    }
}