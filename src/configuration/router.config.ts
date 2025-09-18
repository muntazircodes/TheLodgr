import { Express } from 'express';
import authRoutes from '../routes/auth.routes';

export const initRouter = (app: Express) => {
    app.use('/api/auth', authRoutes);
};
