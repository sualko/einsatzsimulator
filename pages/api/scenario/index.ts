import nc from 'next-connect';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from "next";

export type GetScenarioResponse = {
    id: number,
    name: string,
    description: string,
    latitude: number,
    longitude: number,
}[];

const handler = nc<NextApiRequest, NextApiResponse>()
    .get(async (_, res: NextApiResponse<GetScenarioResponse>) => {
        const scenarios = await prisma.scenario.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                latitude: true,
                longitude: true,
            }
        });

        res.status(200).json(scenarios);
    });

export default handler;