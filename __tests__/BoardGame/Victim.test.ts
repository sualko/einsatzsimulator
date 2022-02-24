import { BodyLocation, Consciousness, Pupils } from "@prisma/client";
import BoardGame from "server/BoardGame";
import Location from "server/BoardGame/Location";
import Victim from "server/BoardGame/Victim";

jest.mock('server/BoardGame');

const boardGame = new (BoardGame as unknown as jest.Mock<BoardGame>)();

const generateVictim = (id: number, name: string, properties = {}) => {
    return new Victim({
        id,
        name,
        age: 40,
        ableToWalk: true,
        consciousness: Consciousness.orientated,
        pupils: Pupils.normal,
        pupilReaction: true,
        breathing: 12,
        locationId: 0,
        scenarioId: 0,
        priority: "Unknown",
        identifier: null,
        injuries: [{
            id: 1,
            enabled: true,
            bodyLocation: BodyLocation.leftLeg,
            severity: 5,
            pain: 8,
            description: 'Open fracture',
            treated: false,
            requiredTime: 3,
            requiredAids: 2,
            requiredEquipment: 1,
            victimId: id,
        }, {
            id: 2,
            enabled: true,
            bodyLocation: BodyLocation.leftArm,
            severity: 6,
            pain: 8,
            description: 'Open fracture',
            treated: false,
            requiredTime: 3,
            requiredAids: 2,
            requiredEquipment: 1,
            victimId: id,
        }, {
            id: 3,
            enabled: false,
            bodyLocation: BodyLocation.leftArm,
            severity: 9,
            pain: 8,
            description: 'Open fracture',
            treated: false,
            requiredTime: 3,
            requiredAids: 2,
            requiredEquipment: 1,
            victimId: id,
        }],
        events: [{
            id: 1,
            time: 1 / 60,
            ableToWalk: false,
            consciousness: null,
            breathing: null,
            pupilReaction: null,
            pupils: null,
            victimId: id,
            dependencies: [{
                id: 1,
            } as any],
            consequences: [],
        }],
        ...properties,
    }, boardGame);
}

describe('Victim', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('should update properties with event for untreated dependency', () => {
        jest.useFakeTimers();

        const victim = generateVictim(1, 'Carl');
        victim.start();

        expect(victim.isAbleToWalk()).toEqual(true);

        jest.runAllTimers();

        expect(victim.isAbleToWalk()).toEqual(false);
        expect(victim.getBreathingFrequenz()).toEqual(12);
    });

    it('should not update properties with event for treated dependency', () => {
        jest.useFakeTimers();

        const victim = generateVictim(1, 'Carl');
        victim.start();

        victim.getInjuryById(1).flagTreated();

        jest.runAllTimers();

        expect(victim.isAbleToWalk()).toEqual(true);
        expect(victim.getBreathingFrequenz()).toEqual(12);
    });

    it('should return next injury to be treated', () => {
        const victim = generateVictim(1, 'Carl');
        const maxInjury = victim.getInjuryById(3);

        expect(victim.getNextInjuryWithHighestSeverity()?.getId()).toEqual(2);

        maxInjury.enable();

        expect(victim.getNextInjuryWithHighestSeverity()?.getId()).toEqual(3);

        maxInjury.flagTreated();

        expect(victim.getNextInjuryWithHighestSeverity()?.getId()).toEqual(2);
    });

    it('should detect if victim needs treatment', () => {
        const victim = generateVictim(1, 'Carl');

        expect(victim.needsTreatment()).toEqual(true);

        victim.getInjuryById(1).disable();
        victim.getInjuryById(2).disable();
        victim.getInjuryById(3).disable();

        expect(victim.needsTreatment()).toEqual(false);

        victim.getInjuryById(1).enable();

        expect(victim.needsTreatment()).toEqual(true);

        victim.getInjuryById(1).flagTreated();

        expect(victim.needsTreatment()).toEqual(false);
    });

    it('should calculate the level of treatment', () => {
        const victim = generateVictim(1, 'Carl');

        expect(victim.getLevelOfTreatment()).toEqual(0);

        victim.getInjuryById(1).flagTreated();

        expect(victim.getLevelOfTreatment()).toEqual(1 / 2);

        victim.getInjuryById(3).enable();

        expect(victim.getLevelOfTreatment()).toBeCloseTo(1 / 3);
    });

    it('should not be able to go to another location', () => {
        const victim = generateVictim(1, 'Carl', { ableToWalk: false });

        expect(() => {
            victim.goTo(new Location({ id: 1, latitude: 0, longitude: 0, name: '', scenarioId: 0 }));
        }).toThrow();
    });
});