import express, { Request, Response, NextFunction } from 'express';

import pino from 'pino';
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';

/**
 * Augment Express' Request type so we can access req.id in code.
 */
declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        interface Request {
            id?: string;
        }
    }
}

/**
 * Create the base Pino logger.
 * - Pretty prints in non-production
 * - Redacts sensitive fields
 */
const logger = pino({
    level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(process.env.NODE_ENV !== 'production'
        ? {
            transport: {
                target: 'pino-pretty',
                options: { translateTime: 'SYS:iso', singleLine: true },
            },
        }
        : {}),
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            '*.password',
            '*.token',
            '*.secret',
        ],
        remove: true,
    },
});

/**
 * Pino HTTP middleware
 * - Adds req.log (child logger) per request
 * - Generates/propagates request id
 * - Structured request/response logs w/ levels
 */
export const httpLogger = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const headerId = req.headers['x-request-id'];
        const id = (Array.isArray(headerId) ? headerId[0] : headerId) ?? randomUUID();
        req.id = id;
        res.setHeader('x-request-id', id);
        return id;
    },
    customLogLevel: (_req, res, err: Error | undefined) => {
        if (err) return 'error';
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    serializers: {
        // keep logs compact but useful
        req(req) {
            return {
                id: (req as unknown as Request).id,
                method: req.method,
                url: req.url,
                remoteAddress: req.remoteAddress,
            };
        },
        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    },
});

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const error = err instanceof Error ? err : new Error(String(err));
    req.log.error(
        {
            err: { message: error.message, stack: error.stack },
            route: req.originalUrl,
            reqId: req.id,
        },
        'unhandled error'
    );

    res.status(500).json({
        ok: false,
        error: 'Internal Server Error',
        reqId: req.id,
    });
};