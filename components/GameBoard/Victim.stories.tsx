import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Victim from './Victim';
import { Priority } from "@prisma/client";

export default {
    component: Victim,
} as ComponentMeta<typeof Victim>;

const Template: ComponentStory<typeof Victim> = (args) => <Victim {...args} />;

export const Unprioritized = Template.bind({});
Unprioritized.args = {
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

export const AbleToWalkPrioritized = Template.bind({});

AbleToWalkPrioritized.args = {
    ...Unprioritized.args,
    priority: Priority.T1,
    identifier: '#99',
};

export const UnableToWalkPrioritized = Template.bind({});

UnableToWalkPrioritized.args = {
    ...AbleToWalkPrioritized.args,
    ableToWalk: false,
};