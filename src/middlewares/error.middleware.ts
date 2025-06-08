import logger from '../utils/logger';
import { NextFunction, Request, Response } from "express";
import ApiError from '../utils/ApiError';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("🚀 ~ errorMiddleware ~ err:", err)
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    logger.error({
        message: 'Error occurred',
        error: err,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body,
    });

    res.status(statusCode).json({
        error: {
            message: message,
        },
    });
};

export default errorMiddleware;
