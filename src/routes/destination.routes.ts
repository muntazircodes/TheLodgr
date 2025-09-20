import { Request, Response, Router } from 'express';
import { DestinationService } from '../services/destination.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const destinationService = new DestinationService();

/**
 *  @method             GET
 *  @description        GET all destinations
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { data } = await destinationService.getAllDestinations();
    res.send(data);
});

/**
 *  @method             POST
 *  @description        Create new destination
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { name, slug, area, center, metadata } = req.body;

    const { data } = await destinationService.create({
        name,
        slug,
        area,
        center,
        metadata,
    });

    res.send(data);
});

/**
 *  @method             GET
 *  @description        GET the destination by ID
 *  @access             private
 */
router.get('/:destinationId', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const { data } = await destinationService.getById({ destinationId });
    res.send(data);
});

/**
 *  @method             PATCH
 *  @description        Update the existing destination
 *  @access             private
 */
router.patch('/:destinationId', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const { name, slug, area, center, metadata } = req.body;

    const { data } = await destinationService.update({
        id: destinationId,
        name,
        slug,
        area,
        center,
        metadata,
    });
    res.send(data);
});

/**
 *  @method             DELETE
 *  @description        Delete the existing destination
 *  @access             private
 */
router.delete('/:destinationId', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const data = await destinationService.delete({ destinationId });
    res.send(data);
});

export default router;
