import BoardGame from './BoardGame';
import { BoardGameEvent } from 'lib/BoardGameEvents';
import Move from './BoardGame/Command/Move';
import TreatPerson from './BoardGame/Command/TreatPerson';
import { TreatLevel } from './BoardGame/Aid';
import Wait from './BoardGame/Command/Wait';

(async function () {
    const boardGame = await BoardGame.load(1);

    for (const eventName of Object.values(BoardGameEvent)) {
        boardGame.on(eventName, (...args) => {
            console.log(`[EV][${eventName}] `, ...args);
        });
    }

    await boardGame.start();

    console.log(boardGame.getData());

    console.log(boardGame.toString());

    // const damageZone = new Location(1);
    // const assemblyArea = new Location(2);
    const treatmentUnit = boardGame.getLocation(3);

    const karl = boardGame.getAid(1);
    const carla = boardGame.getAid(2);
    const sabine = boardGame.getVictim(2);

    const moveOrder = new Move(treatmentUnit);

    await Promise.all([
        karl.communicate(moveOrder),
        carla.communicate(moveOrder),
    ]);

    console.log(boardGame.toString());

    const treatOrder = new TreatPerson(sabine, TreatLevel.Complete);

    // boardGame.assignAidToVictim(1, 2);

    await Promise.all([
        karl.communicate(treatOrder),
        carla.communicate(treatOrder),
    ]);

    console.log('Karl and Carla should be done');

    const waitOrder = new Wait();

    await Promise.all([
        karl.communicate(waitOrder),
        carla.communicate(waitOrder),
    ]);

    console.log(boardGame.toString());

    console.log('Karl and Carla should be waiting');
})();