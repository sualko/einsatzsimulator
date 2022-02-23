import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import PersonalGear from './PersonalGear';
import { Leader, Qualification } from "@prisma/client";

export default {
    component: PersonalGear,
} as ComponentMeta<typeof PersonalGear>;

const Template: ComponentStory<typeof PersonalGear> = (args) => <PersonalGear {...args} />;

export const RettungshelferGroup = Template.bind({});
RettungshelferGroup.args = {
    name: 'K. Foobar',
    leader: Leader.Group,
    qualification: Qualification.RH,
    radio: {
        channel: 31,
        mode: 0,
    }
}

export const NotarztUnit = Template.bind({});
NotarztUnit.args = {
    name: 'K. Foobar',
    leader: Leader.Unit,
    qualification: Qualification.NA,
    radio: {
        channel: 39,
        mode: 1,
    }
}