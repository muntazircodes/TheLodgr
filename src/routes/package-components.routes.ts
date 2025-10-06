import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { PackageComponentsService } from '../services/package-components.service';

const router = Router({ mergeParams: true });
const packageComponentsService = new PackageComponentsService();

/**
 *  @method             GET
 *  @description        List components for a package
 *  @access             protected
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const components = await packageComponentsService.listByPackage({ packageId });
    res.send(components);
});

/**
 *  @method             POST
 *  @description        Add a component to a package
 *  @access             protected (admin)
 */
router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const { component_type, component_id, quantity, price, meta } = req.body;

    const created = await packageComponentsService.create({
        package_id: packageId,
        component_type,
        component_id,
        quantity,
        price,
        meta,
    });

    res.send(created);
});

/**
 *  @method             GET
 *  @description        Get a component by ID under a package
 *  @access             protected
 */
router.get('/:componentId', [authMiddleware], async (req: Request, res: Response) => {
    const { packageId, componentId } = req.params;
    const component = await packageComponentsService.getById({ componentId, packageId });
    res.send(component);
});

/**
 *  @method             PATCH
 *  @description        Update a package component by ID
 *  @access             protected (admin)
 */
router.patch('/:componentId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { componentId } = req.params;
    const { component_type, component_id, quantity, price, meta } = req.body;

    const updated = await packageComponentsService.update(componentId, {
        component_type,
        component_id,
        quantity,
        price,
        meta,
    });

    res.send(updated);
});

/**
 *  @method             DELETE
 *  @description        Remove a component from a package
 *  @access             protected (admin)
 */
router.delete('/:componentId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { componentId } = req.params;
    await packageComponentsService.delete({ componentId });
    res.send({ success: true });
});

export default router;
