import { BodyLocation } from "@prisma/client";
import SanAid from "server/BoardGame/Aid/SanAid";
import Injury from "server/BoardGame/Injury";

jest.mock('server/BoardGame/Aid/SanAid', () => {
    return function(id: number) {
        return {
            getId: () => id,
        };
    };
});

const basicInjuryData = {
    id: 0,
    enabled: true,
    bodyLocation: BodyLocation.leftLeg,
    severity: 5,
    pain: 8,
    description: 'Open fracture',
    treated: false,
    requiredTime: 2,
    requiredAids: 2,
    requiredEquipment: 1,
    victimId: 0,
}

const getAid = (id: number) => new (SanAid as jest.Mock<SanAid>)(id);

describe('Injury', () => {
    it('is doable', () => {

        const injury = new Injury({ ...basicInjuryData });

        expect(injury.isDoable()).toBe(true);
    });

    it('is requiring the number of aids to treat', () => {
        const injury = new Injury({
            ...basicInjuryData,
            requiredTime: 1 / 60,
            requiredAids: 2,
        });

        const aid1 = getAid(1);
        const aid2 = getAid(2);
        const aid3 = getAid(3);

        return Promise.all([
            expect(injury.treat(aid1)).resolves.toBe(true),
            expect(injury.treat(aid2)).resolves.toBe(true),
            expect(injury.treat(aid3)).rejects.toBeInstanceOf(Error),
        ]);
    });

    it('is returning the same treat promise for every aid', () => {
        const injury = new Injury({
            ...basicInjuryData,
            requiredAids: 3,
        });

        const aid1 = getAid(1);
        const aid2 = getAid(2);

        const p1a = injury.treat(aid1);
        const p1b = injury.treat(aid1);
        const p2 = injury.treat(aid2);

        expect(p1a).toEqual(p1b);
        expect(p1b).toEqual(p2);
    });

    it('is repeatable for treated injuries', async () => {
        const injury = new Injury({
            ...basicInjuryData,
            treated: true,
        });

        const aid = getAid(1);

        expect(await injury.treat(aid)).toBe(true);
    });

    it('active treatment can be aborted', () => {
        expect.assertions(5);

        const injury = new Injury({
            ...basicInjuryData,
            requiredTime: 1,
            requiredAids: 2,
        });

        const aid1 = getAid(1);
        const aid2 = getAid(2);

        return Promise.all([
            expect(injury.treat(aid1)).resolves.toBe(false),
            expect(injury.treat(aid2)).resolves.toBe(false),
            new Promise<void>((resolve) => {
                injury.abortTreatment();

                expect(injury.getManpower()).toEqual(0);
                expect(injury.isProcessed()).toEqual(false);
                expect(injury.isDoable()).toEqual(true);

                resolve();
            }),
        ]);
    });

    it('pending treatment can be aborted for single aid', () => {
        expect.assertions(4);

        const injury = new Injury({
            ...basicInjuryData,
            requiredTime: 1,
            requiredAids: 3,
        });

        const aid1 = getAid(1);
        const aid2 = getAid(2);

        // should not resolve
        expect(injury.treat(aid2)).resolves.toBe(true);

        return Promise.all([
            expect(injury.treat(aid1)).resolves.toBe(false),
            new Promise<void>((resolve) => {
                injury.abortTreatment(aid1);

                expect(injury.getManpower()).toEqual(1);
                expect(injury.isProcessed()).toEqual(false);
                expect(injury.isDoable()).toEqual(true);

                resolve();
            }),
        ]);
    });
})