import { Express } from 'express';

import authRoutes from '../routes/auth.routes';
import destionRoutes from '../routes/destination.routes';
import healthRoutes from '../routes/health.routes';
import packageRoutes from '../routes/package.routes';
import poiCategoryRoutes from '../routes/poi-catergory.routes';
import poiRatingRoutes from '../routes/poi-rating.routes';
import poiWishlistRoutes from '../routes/poi-wishist.routes';
import poiRoutes from '../routes/poi.routes';
import priceRoutes from '../routes/price.routes';
import userProfileRoutes from '../routes/user.routes';
import weatherRoutes from '../routes/weather.routes';

export const initRouter = (app: Express) => {
    app.use('/api/v1/health', healthRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/v1/users', userProfileRoutes);
    app.use('/api/v1/destinations', destionRoutes);
    app.use('/api/v1/destination/:destinationId/weather', weatherRoutes);
    app.use('/api/v1/destinations/:destinationId/pois', poiRoutes);
    app.use('/api/v1/packages', packageRoutes);
    app.use('/api/v1/destinations/:destinationId/pois/:poiId/ratings', poiRatingRoutes);
    app.use('/api/v1/destinations/:destinationId/pois/:poiId/wishlist', poiWishlistRoutes);
    app.use('/api/v1/poi-categories', poiCategoryRoutes);
    app.use('/api/v1/prices', priceRoutes);
};
