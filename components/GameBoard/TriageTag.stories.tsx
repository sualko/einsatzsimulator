import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import TriageTag from './TriageTag';
import { Priority } from "@prisma/client";

export default {
    component: TriageTag,
} as ComponentMeta<typeof TriageTag>;

const Template: ComponentStory<typeof TriageTag> = (args) => <TriageTag {...args} />;

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

export const Prioritized = Template.bind({});

Prioritized.args = {
    ...Unprioritized.args,
    priority: Priority.T1,
    identifier: '#99',
};