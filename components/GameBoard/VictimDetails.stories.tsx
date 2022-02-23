import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import VictimDetails from './VictimDetails';
import { BodyLocation, Priority } from "@prisma/client";

export default {
    component: VictimDetails,
} as ComponentMeta<typeof VictimDetails>;

const Template: ComponentStory<typeof VictimDetails> = (args) => <VictimDetails {...args} />;

export const NoInjuries = Template.bind({});
NoInjuries.args = {
    id: 1,
    ableToWalk: true,
    age: 20,
    breathing: 12,
    consciousness: 'orientated',
    injuries: [],
    locationId: 1,
    name: 'Karl',
    pupilReaction: true,
    pupils: 'normal',
    scenarioId: 0,
    priority: Priority.Unknown,
    identifier: '',
};

export const Injured = Template.bind({});
Injured.args = {
    ...NoInjuries.args,
    ableToWalk: false,
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
        victimId: 1,
    }],
}