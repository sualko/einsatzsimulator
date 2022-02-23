import withJoi from "next-joi";
import type { NextApiRequest } from 'next'

export interface ValidatedApiRequest<Body = any, Query extends NextApiRequest['query'] = NextApiRequest['query']> extends NextApiRequest {
    body: Body
    query: Query
}

export default withJoi();