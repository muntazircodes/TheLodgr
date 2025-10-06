import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import adminAuthMiddleWare from '../middlewares/have-access.middleware';
import { PackagesService } from '../services/packages.service';

const router = Router();
const packagesService = new PackagesService();

/**
 *  @method             GET
 *  @description        Get all packages
 *  @access             protected
 */
router.get('/', [authMiddleware], async (_req: Request, res: Response) => {
    const packages = await packagesService.getAll();
    res.send(packages);
});

/**
 *  @method             POST
 *  @description        Create a new package
 *  @access             protected (admin)
 */
router.post('/', [authMiddleware, adminAuthMiddleWare], async (req: Request, res: Response) => {
    const { name, description, duration_days, base_price, user_id, is_custom, is_active } = req.body;
    const created = await packagesService.create({
        name,
        description,
        duration_days,
        base_price,
        user_id,
        is_custom,
        is_active,
    });
    res.send(created);
});

/**
 *  @method             GET
 *  @description        Get a package by ID
 *  @access             protected
 */
router.get('/:packageId', [authMiddleware], async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const pkg = await packagesService.getById({ packageId });
    res.send(pkg);
});

/**
 *  @method             PATCH
 *  @description        Update a package by ID
 *  @access             protected (admin)
 */
router.patch('/:packageId', [authMiddleware, adminAuthMiddleWare], async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const { name, description, duration_days, base_price, user_id, is_custom, is_active } = req.body;

    const updated = await packagesService.update(packageId, {
        name,
        description,
        duration_days,
        base_price,
        user_id,
        is_custom,
        is_active,
    });

    res.send(updated);
});

/**
 *  @method             DELETE
 *  @description        Delete a package by ID
 *  @access             protected (admin)
 */
router.delete('/:packageId', [authMiddleware, adminAuthMiddleWare], async (req: Request, res: Response) => {
    const { packageId } = req.params;
    await packagesService.delete({ packageId });
    res.send({ success: true });
});

export default router;
