
export enum BoardGameEvent {
    Started = 'STARTED',

    MovementStart = 'MOVEMENT_START',
    MovementEnd = 'MOVEMENT_END',

    AidNew = 'AID_NEW',
    AidBusy = 'AID_BUSY',
    AidStandby = 'AID_STANDBY',
    AidUpdate = 'AID_UPDATE',

    VictimNew = 'VICTIM_NEW',
    VictimUpdate = 'VICTIM_UPDATE',
}
