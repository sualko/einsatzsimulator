import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Aid from './Aid';
import { Leader, Qualification } from "@prisma/client";

export default {
    component: Aid,
} as ComponentMeta<typeof Aid>;

const Template: ComponentStory<typeof Aid> = (args) => <Aid {...args} />;

export const GroupLeader = Template.bind({});
GroupLeader.args = {
    name: 'F. Bar',
    qualification: Qualification.RH,
    leader: Leader.Group,
};