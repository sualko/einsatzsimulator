import nc from 'next-connect';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import validate from "lib/middleware/validate";

export type CreateGameResponse = {
    id: string,
};

export type CreateBody = {
    scenarioId: number,
}

const createBody = Joi.object({
    scenarioId: Joi.number().required(),
})

const handler = nc<NextApiRequest, NextApiResponse>()
    .post<{body: CreateBody}>(validate({body: createBody}), async (req, res: NextApiResponse<CreateGameResponse>) => {
        const scenarioId = parseInt(req.body.scenarioId, 10);

        const game = await prisma.match.create({
            data: {
                scenarioId,
            },
        });

        res.status(200).json({
            id: game.id,
        });
    });

export default handler;