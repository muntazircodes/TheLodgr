import { ForbiddenError } from '@hyperflake/http-errors';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user?.roles?.includes('ADMIN')) {
        throw new ForbiddenError('Access Denied');
    }

    next();
};
