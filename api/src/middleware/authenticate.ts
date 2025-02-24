import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.sendStatus(403);
        return;
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!,
        (err, decoded: any) => {
            if (err) return res.sendStatus(403);
            res.locals.userId = decoded.id;
            next();
        }
    );
}
