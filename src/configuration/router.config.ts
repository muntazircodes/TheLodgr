import { Express } from 'express';

import healthRoutes from '../routes/health.routes';
import authRoutes from '../routes/auth.routes';
import userProfileRoutes from '../routes/user.routes';
import destionRoutes from '../routes/destination.routes';

export const initRouter = (app: Express) => {
    app.use('/api/v1/health', healthRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/v1/users', userProfileRoutes);
    app.use('/api/v1/destinations', destionRoutes);
};
