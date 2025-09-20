import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { WeatherService } from '../services/weather.service';

const router = Router({ mergeParams: true });
const weatherService = new WeatherService();

/**
 *  @method             GET
 *  @description        Get weather forecast for a destination
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const weather = await weatherService.getStoredForecast(destinationId);
    res.send(weather);
});

/**
 *  @method             POST
 *  @description        Manually trigger weather update for a destination
 *  @access             protected
 *  @route              /api/v1/weather/destination/:destinationId/update
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const { isFinal = false } = req.body;

    await weatherService.fetchAndStoreForDestination(destinationId, isFinal);

    res.send({
        message: 'Weather data updated successfully',
        destinationId,
        isFinal,
        timestamp: new Date().toISOString(),
    });
});

export default router;
