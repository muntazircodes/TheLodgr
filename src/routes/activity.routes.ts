import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { ActivityService } from '../services/activities.service';

const activityService = new ActivityService();
const router = Router({ mergeParams: true });

/**
 *  @method             GET
 *  @description        GET all activities for a destination
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const activities = await activityService.getAll({ destinationId });
    res.send(activities);
});

/**
 *  @method             POST
 *  @description        Create an activity under a destination
 *  @access             private
 */
router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const {
        poi_id,
        category_id,
        name,
        description,
        image_url,
        duration_minutes,
        capacity,
        difficulty,
        requirements,
        base_price,
        price_type,
        is_active,
    } = req.body;

    const activity = await activityService.create({
        destination_id: destinationId,
        poi_id,
        category_id,
        name,
        description,
        image_url,
        duration_minutes,
        capacity,
        difficulty,
        requirements,
        base_price,
        price_type,
        is_active,
    });

    res.send(activity);
});

/**
 *  @method             GET
 *  @description        GET activity by ID (scoped by destination)
 *  @access             private
 */
router.get('/:activityId', [authMiddleware], async (req: Request, res: Response) => {
    const { activityId, destinationId } = req.params;
    const activity = await activityService.getById({ activityId, destinationId });
    res.send(activity);
});

/**
 *  @method             PATCH
 *  @description        Update an activity by ID
 *  @access             private
 */
router.patch('/:activityId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { activityId } = req.params;

    const {
        name,
        description,
        image_url,
        duration_minutes,
        capacity,
        difficulty,
        requirements,
        base_price,
        price_type,
        is_active,
    } = req.body;

    const activity = await activityService.update(activityId, {
        name,
        description,
        image_url,
        duration_minutes,
        capacity,
        difficulty,
        requirements,
        base_price,
        price_type,
        is_active,
    });

    res.send(activity);
});

/**
 *  @method             DELETE
 *  @description        Delete an activity by ID
 *  @access             private
 */
router.delete('/:activityId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { activityId } = req.params;
    const activity = await activityService.delete({ activityId });
    res.send(activity);
});

export default router;
