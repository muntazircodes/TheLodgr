import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { AccommodationService } from '../services/accommodation.service';

const router = Router({ mergeParams: true });
const accommodationService = new AccommodationService();

/**
 *  @method             GET
 *  @description        GET all accommodations for a destination
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const accommodations = await accommodationService.getAll({ destinationId });
    res.send(accommodations);
});

/**
 *  @method             GET
 *  @description        GET accommodation by ID
 *  @access             private
 */
router.get('/:accommodationId', [authMiddleware], async (req: Request, res: Response) => {
    const { accommodationId } = req.params;
    const accommodation = await accommodationService.getById({ accommodationId });
    res.send(accommodation);
});

/**
 *  @method             POST
 *  @description        Create a new accommodation
 *  @access             private
 */
router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { destinationId } = req.params;
    const { name, type, description, price_per_night, capacity, amenities, images, is_active } = req.body;
    const created = await accommodationService.create({
        destination_id: destinationId,
        name,
        type,
        description,
        price_per_night,
        capacity,
        amenities,
        images,
        is_active,
    });
    res.send(created);
});

/**
 *  @method             PATCH
 *  @description        Update an existing accommodation
 *  @access             private
 */
router.patch('/:accommodationId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { accommodationId } = req.params;
    const { name, type, description, price_per_night, capacity, amenities, images, is_active } = req.body;
    const updated = await accommodationService.update(accommodationId, {
        name,
        type,
        description,
        price_per_night,
        capacity,
        amenities,
        images,
        is_active,
    });
    res.send(updated);
});

/**
 *  @method             DELETE
 *  @description        Delete an accommodation by ID
 *  @access             private
 */
router.delete('/:accommodationId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { accommodationId } = req.params;
    await accommodationService.delete({ accommodationId });
    res.send({ success: true });
});

export default router;
