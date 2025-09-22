import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { PoiRatingService } from '../services/poi-rating.service';
import { deflateSync } from 'zlib';

const poiRatingService = new PoiRatingService();
const router = Router({ mergeParams: true });

/**
 *  @method             GET
 *  @description        GET all poi ratings
 *  @access             private
 */

router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { poiId } = req.params;
    const poiRatings = await poiRatingService.getAllRatings({ poiId });
    res.send(poiRatings);
});

/**
 *  @method             GET
 *  @description        Get Poi rating by Id
 *  @access             private
 */

router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { poiId } = req.params;
    const userId = req.user?.id as string;

    const { rating, review, images, visit_date } = req.body;

    const poiRating = await poiRatingService.create({
        poi_id: poiId,
        user_id: userId,
        rating,
        review,
        images,
        visit_date,
    });
    res.send(poiRating);
});

/**
 *  @method             POST
 *  @description        Create POI rating
 *  @access             private
 */

router.get('/:ratingId', [authMiddleware], async (req: Request, res: Response) => {
    const { ratingId } = req.params;
    const poiRating = await poiRatingService.getById({ ratingId });
    res.send(poiRating);
});

/**
 *  @method             PATCH
 *  @description        Update the POI rating
 *  @access             private
 */

router.patch('/:ratingId', [authMiddleware], async (req: Request, res: Response) => {
    const { ratingId } = req.params;
    const { rating, review, images, visit_date } = req.body;
    const poiRating = await poiRatingService.update(ratingId, { rating, review, images, visit_date });
    res.send(poiRating);
});

/**
 *  @method             DELETE
 *  @description        Delete the POI rating
 *  @access             private
 */

router.delete('/:ratingId', [authMiddleware], async (req: Request, res: Response) => {
    const { ratingId } = req.params;
    const poiRating = await poiRatingService.delete(ratingId);
    res.send(poiRating);
});

export default router;
