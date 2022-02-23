import { Aid as PureAid, Location as PureLocation, Scenario } from ".prisma/client";
import EventEmitter from "eventemitter3";
import { BoardGameEvent } from "lib/BoardGameEvents";
import { BoardGameEvents } from "lib/socket";
import prisma from "../../lib/prisma";
import Aid from "./Aid";
import AidFactory from "./AidFactory";
import Location from "./Location";
import Victim, { VictimData } from "./Victim";

type BoardGameInitData = {
    scenario: Scenario,
    locations: PureLocation[],
    aids: PureAid[],
    victims: VictimData[],
}

export default class BoardGame extends EventEmitter<BoardGameEvents> {

    //@TODO use new Map()
    private victims: { [id: number]: Victim } = {};
    private aids: { [id: number]: Aid } = {};
    private locations: {[id: number]: Location} = {};

    private started = false;

    constructor(private data: BoardGameInitData) {
        super();

        for (const victimData of this.data.victims) {
            this.victims[victimData.id] = new Victim(victimData, this);
        }

        for (const aidData of this.data.aids) {
            this.aids[aidData.id] = AidFactory.generate(aidData, this);
        }
    }

    public getData() {
        return {
            scenario: this.data.scenario,
            locations: this.data.locations,
        };
    }

    public async start(): Promise<void> {
        if (this.started) {
            return;
        }

        console.log('Board game will start');

        this.getVictims().forEach(victim => victim.start());
        this.getAids().forEach(aid => aid.start());

        this.started = true;

        this.emit(BoardGameEvent.Started);
    }

    public hasStarted(): boolean {
        return this.started;
    }

    public getVictim(id: number): Victim {
        return this.victims[id];
    }

    public getAid(id: number): Aid {
        return this.aids[id];
    }

    public getVictims(locationId?: number): Victim[] {
        return Object.values(this.victims).filter(victim => !locationId || victim.getLocationId() === locationId );
    }

    public getAids(locationId?: number): Aid[] {
        return Object.values(this.aids).filter(aid => !locationId || aid.getLocationId() === locationId );
    }

    public getLocation(id: number): Location {
        if (!(id in this.locations)) {
            const locationData = this.data.locations.find(location => location.id === id);

            if (!locationData) {
                throw new Error('Location id unknown');
            }

            this.locations[id] = new Location(locationData);
        }

        return this.locations[id];
    }

    public getLocationByName(name: string): Location | undefined {
        const locations = this.getLocations().filter(location => location.getName() === name);

        return locations.length > 0 ? locations[0] : undefined;
    }

    public getLocations(): Location[] {
        return this.data.locations.map(location => this.getLocation(location.id));
    }

    public static async load(scenarioId: number) {
        const scenario = await prisma.scenario.findUnique({
            where: {
                id: scenarioId,
            },
        });

        if (!scenario) {
            throw new Error('Scenario not found');
        }

        const locations = await prisma.location.findMany({
            where: {
                scenarioId: scenario.id,
            }
        });

        const aids = await prisma.aid.findMany({
            where: {
                scenarioId: scenario.id,
            },
        });

        const victims = await prisma.victim.findMany({
            where: {
                scenarioId: scenario.id,
            },
            include: {
                events: {
                    include: {
                        dependencies: true,
                        consequences: true,
                    }
                },
                injuries: true,
            }
        });

        return new BoardGame({ scenario, locations, aids, victims });
    }

    public toString(): string {
        let output = (new Date()).toLocaleString() + `\n`;

        for (const location of this.data.locations) {
            output += `# ${location.name} (${location.id})\n\n`;

            const aids = this.getAids(location.id);

            for (const aid of aids) {
                output += `\t> ${aid.getName()} (${aid.getId()})\n`;
            }

            if (aids.length === 0) {
                output += '\tNo aids\n';
            }

            output += `\n`;

            const victims = this.getVictims(location.id);

            for (const victim of victims) {
                output += `\t= ${victim.getName()} [${victim.getId()}] (${Math.round(victim.getLevelOfTreatment() * 10000)/100}%)\n`;
            }

            if (victims.length === 0) {
                output += '\tNo victims\n';
            }

            output += `\n\n`;
        }

        return output;
    }
}