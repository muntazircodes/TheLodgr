import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { PoiService } from '../services/pois.service';

const poiService = new PoiService();
const router = Router({ mergeParams: true });

/**
 *  @method             GET
 *  @description        GET all the pois
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const pois = await poiService.getAll({ destinationId });

    res.send(pois);
});

/**
 *  @method             POST
 *  @description        Create the POIs
 *  @access             private
 */

router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const {
        name,
        description,
        category_id,
        latitude,
        longitude,
        elevation,
        address,
        contact_info,
        opening_hours,
        images,
        is_active,
        max_zoom,
        min_zoom,
        priority,
    } = req.body;
    const poi = await poiService.create({
        name,
        destination_id: destinationId,
        description,
        category_id,
        latitude,
        longitude,
        elevation,
        address,
        contact_info,
        opening_hours,
        images,
        is_active,
        max_zoom,
        min_zoom,
        priority,
    });
    res.send(poi);
});

/**
 *  @method             GET
 *  @description        GET the POI by ID
 *  @access             private
 */
router.get('/:poiId', [authMiddleware], async (req: Request, res: Response) => {
    const { poiId, destinationId } = req.params;
    const poi = await poiService.getById({ destinationId, poiId });
    res.send(poi);
});

/**
 *  @method             Patch
 *  @description        Update the POI
 *  @access             private
 */

router.patch('/:poiId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { poiId } = req.params;

    const {
        name,
        description,
        latitude,
        longitude,
        elevation,
        address,
        contact_info,
        opening_hours,
        images,
        is_active,
        max_zoom,
        min_zoom,
        priority,
    } = req.body;

    const poi = await poiService.update(poiId, {
        name,
        description,
        latitude,
        longitude,
        elevation,
        address,
        contact_info,
        opening_hours,
        images,
        is_active,
        max_zoom,
        min_zoom,
        priority,
    });

    res.send(poi);
});

/**
 *  @method             Delete
 *  @description        Delete the POI
 *  @access             private
 */

router.delete('/:poiId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { poiId } = req.params;
    const poi = await poiService.delete({ poiId });
    res.send(poi);
});

export default router;
