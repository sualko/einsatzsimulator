import BoardGame from "server/BoardGame";
import Move from "server/BoardGame/Command/Move";
import Wait from "server/BoardGame/Command/Wait";
import Location from "server/BoardGame/Location";
import AbstractPerson from "server/BoardGame/Person";

// jest.spyOn(global, 'setTimeout');

jest.mock('server/BoardGame');

class Person extends AbstractPerson {
    public getData() {
        throw new Error("Method not implemented.");
    }
    protected getType(): any {
        return undefined;
    }
}

const boardGame = new (BoardGame as unknown as jest.Mock<BoardGame>)();

const generatePerson = (id: number, name: string, locationId = 0) => {
    return new Person({
        id,
        name,
        locationId,
    }, boardGame);
}

describe('Person', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it('should execute commands in order', async () => {
        expect.assertions(7);

        const person = generatePerson(1, 'Tiger');

        const command1 = new Wait();
        const command1Spy = jest.spyOn(command1, 'getType');

        const command2 = new Wait();
        const command2Spy = jest.spyOn(command2, 'getType');

        const command3 = new Wait();
        const command3Spy = jest.spyOn(command3, 'getType');

        expect(person.communicate(command1, false)).resolves.toEqual(true);
        expect(person.communicate(command2, false)).resolves.toEqual(true);
        expect(await person.communicate(command3, false)).toEqual(true);

        expect(command1Spy.mock.invocationCallOrder[0]).toBeLessThan(command2Spy.mock.invocationCallOrder[0]);
        expect(command2Spy.mock.invocationCallOrder[0]).toBeLessThan(command3Spy.mock.invocationCallOrder[0]);

        expect(person.getPendingWorkload()).toEqual(0);
        expect(person.getExecutingCommand()).toEqual(undefined);
    });

    it('should force a command', async () => {
        expect.assertions(6);

        const person = generatePerson(1, 'Tiger');

        const command1 = new Wait();

        const command2 = new Wait();

        const command3 = new Wait();

        expect(person.communicate(command1)).resolves.toEqual(true);

        expect(person.getExecutingCommand()).toEqual(command1);

        expect(person.communicate(command2)).resolves.toEqual(false);
        expect(await person.communicate(command3)).toEqual(true);

        expect(person.getPendingWorkload()).toEqual(0);
        expect(person.getExecutingCommand()).toEqual(undefined);
    });

    it('should not move to current location', async () => {
        const person = generatePerson(1, 'Tiger');

        const move = new Move(new Location({ id: 0, name: '', scenarioId: 0, latitude: 0, longitude: 0 }));

        expect(await person.communicate(move)).toEqual(true);
        expect(person.getLocationId()).toEqual(0);
    }, 1000);

    it('should move to new location', async () => {
        jest.useFakeTimers();

        const person = generatePerson(1, 'Tiger');

        const move = new Move(new Location({ id: 1, name: '', scenarioId: 0, latitude: 0, longitude: 0 }));

        const promise = person.communicate(move);

        jest.runAllTimers();

        return promise.then(success => {
            expect(success).toEqual(true);

            expect(person.getLocationId()).toEqual(1);
        });
    });
});