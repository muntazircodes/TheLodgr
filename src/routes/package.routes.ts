import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { PackagesService } from '../services/packages.service';

const router = Router({ mergeParams: true });
const packagesService = new PackagesService();

/**
 *  @method             POST
 *  @description        Generate a package quote (not persisted)
 *  @access             private
 */
router.post('/generate', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { destinationId, poiIds, currency, name, description } = req.body as {
        destinationId: string;
        poiIds: string[];
        currency?: string;
        name?: string;
        description?: string;
    };
    const quote = await packagesService.generate({ userId, destinationId, poiIds, currency, name, description });
    res.send(quote);
});

/**
 *  @method             POST
 *  @description        Persist a package under current user (click Done flow)
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { destination_id, name, description, poi_ids, breakdown, currency, is_active, priority } = req.body;
    const pkg = await packagesService.create({
        user_id: userId,
        destination_id,
        name,
        description,
        poi_ids,
        breakdown,
        currency,
        is_active,
        priority,
    });
    res.send(pkg);
});

/**
 *  @method             GET
 *  @description        List current user's packages
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const packages = await packagesService.getAll({ userId });
    res.send(packages);
});

/**
 *  @method             GET
 *  @description        Get a package by ID (current user)
 *  @access             private
 */
router.get('/:packageId', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { packageId } = req.params;
    const pkg = await packagesService.getById({ userId, packageId });
    res.send(pkg);
});

/**
 *  @method             PATCH
 *  @description        Update a package (current user)
 *  @access             private
 */
router.patch('/:packageId', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { packageId } = req.params;
    const update = req.body;
    const pkg = await packagesService.update({ userId, packageId, update });
    res.send(pkg);
});

/**
 *  @method             DELETE
 *  @description        Delete a package (current user)
 *  @access             private
 */
router.delete('/:packageId', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { packageId } = req.params;
    const result = await packagesService.delete({ userId, packageId });
    res.send(result);
});

export default router;
