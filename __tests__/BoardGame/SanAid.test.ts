import { BodyLocation, Consciousness, Leader, Pupils, Qualification } from "@prisma/client";
import BoardGame from "server/BoardGame";
import { TreatLevel } from "server/BoardGame/Aid";
import SanAid from "server/BoardGame/Aid/SanAid";
import TreatPerson from "server/BoardGame/Command/TreatPerson";
import Wait from "server/BoardGame/Command/Wait";
import Victim from "server/BoardGame/Victim";

jest.mock('server/BoardGame');

const boardGame = new (BoardGame as unknown as jest.Mock<BoardGame>)();

const generateAid = (id: number, name: string, locationId = 0) => {
    return new SanAid({
        id,
        name,
        age: 30,
        qualification: Qualification.SAN,
        leader: Leader.None,
        scenarioId: 0,
        locationId,
        victimId: null,
        playedBy: null,
    }, boardGame);
}

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
            requiredTime: 1/60,
            requiredAids: 1,
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
            requiredTime: 1/60,
            requiredAids: 1,
            requiredEquipment: 1,
            victimId: id,
        }, {
            id: 3,
            enabled: false,
            bodyLocation: BodyLocation.head,
            severity: 9,
            pain: 8,
            description: 'Open fracture',
            treated: false,
            requiredTime: 1/60,
            requiredAids: 1,
            requiredEquipment: 1,
            victimId: id,
        }],
        events: [],
        ...properties,
    }, boardGame);
}

describe('SanAid', () => {
    it('should treat all injuries ordered by severity', async () => {
        const aid = generateAid(0, 'Fritz');
        const victim = generateVictim(0, 'John');

        const leftLeg = victim.getInjuryById(1);
        const leftArm = victim.getInjuryById(2);

        const leftLegSpy = jest.spyOn(leftLeg, 'treat');
        const leftArmSpy = jest.spyOn(leftArm, 'treat');

        expect(await aid.communicate(new TreatPerson(victim, TreatLevel.Complete))).toEqual(true);

        expect(leftLegSpy).toBeCalled();
        expect(leftArmSpy).toBeCalled();

        expect(leftArmSpy.mock.invocationCallOrder[0]).toBeLessThan(leftLegSpy.mock.invocationCallOrder[0]);

        expect(leftLeg.isTreated()).toEqual(true);
        expect(leftArm.isTreated()).toEqual(true);
        expect(victim.needsTreatment()).toEqual(false);
    }, 6000);

    it('should be possible to abort a treatment', async () => {
        const aid = generateAid(0, 'Fritz');
        const victim = generateVictim(0, 'John');

        const leftLeg = victim.getInjuryById(1);
        const leftArm = victim.getInjuryById(2);

        expect(aid.communicate(new TreatPerson(victim, TreatLevel.Complete))).resolves.toEqual(true);

        expect(await aid.communicate(new Wait(0))).toEqual(true);

        expect(leftLeg.isTreated()).toEqual(false);
        expect(leftArm.isTreated()).toEqual(true);

        expect(aid.getPendingWorkload()).toEqual(0);
        expect(aid.getExecutingCommand()).toEqual(undefined);
    });

    it('should treat new injuries', async () => {
        const aid = generateAid(0, 'Fritz');
        const victim = generateVictim(0, 'John');

        const leftLeg = victim.getInjuryById(1);
        const leftArm = victim.getInjuryById(2);
        const head = victim.getInjuryById(3);

        expect(await aid.communicate(new TreatPerson(victim, TreatLevel.Complete))).toEqual(true);

        expect(leftLeg.isTreated()).toEqual(true);
        expect(leftArm.isTreated()).toEqual(true);
        expect(victim.needsTreatment()).toEqual(false);
        expect(head.isTreated()).toEqual(false);

        head.enable();

        await new Promise(resolve => {
            setTimeout(resolve, 6000);
        });

        expect(head.isTreated()).toEqual(true);
    }, 15000)
});