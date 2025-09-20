import { Request, Response, Router } from 'express';
import { DestinationService } from '../services/destination.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const destinationService = new DestinationService();

/**
 *  @method             GET
 *  @description        Get all destinations
 *  @access             protected
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const destinations = await destinationService.getAll();
    res.send(destinations);
});

/**
 *  @method             POST
 *  @description        Create a new destination
 *  @access             protected
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { name, slug, area, metadata } = req.body;
    const destination = await destinationService.create({ name, slug, area, metadata });
    res.send(destination);
});

/**
 *  @method             GET
 *  @description        Get a destination by ID
 *  @access             protected
 */
router.get('/:destinationId', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const destination = await destinationService.getById(destinationId);
    res.send(destination);
});

/**
 *  @method             PATCH
 *  @description        Update a destination by ID
 *  @access             protected
 */
router.patch('/:destinationId', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const { name, slug, area, metadata } = req.body;

    const destination = await destinationService.update(destinationId, { name, slug, area, metadata });
    res.send(destination);
});

/**
 *  @method             DELETE
 *  @description        Delete a destination by ID
 *  @access             protected
 */
router.delete('/:destinationId', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const destination = await destinationService.delete(destinationId);
    res.send(destination);
});

export default router;
