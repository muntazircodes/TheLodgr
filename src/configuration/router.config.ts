import { Express } from 'express';
import authRoutes from '../routes/auth.routes';
import healthRoutes from '../routes/health.routes';
export const initRouter = (app: Express) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/v1/health', healthRoutes);
};
