import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const timestamp = new Date().toLocaleString();

    console.log(`[${timestamp}] ${method} ${url}`);

    next();
};

export default logger;