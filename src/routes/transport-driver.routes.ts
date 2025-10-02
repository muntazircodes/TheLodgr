import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { TransportDriverService } from '../services/transport-driver.service';

const router = Router();
const transportDriverService = new TransportDriverService();

/**
 *  @method             GET
 *  @description        GET all transport drivers
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const drivers = await transportDriverService.getAll();
    res.send(drivers);
});

/**
 *  @method             POST
 *  @description        Create a new transport driver
 *  @access             private
 */
router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { name, phone, license_number, languages, is_active } = req.body;
    const created = await transportDriverService.create({
        name,
        phone,
        license_number,
        languages,
        is_active,
    });
    res.send(created);
});

/**
 *  @method             GET
 *  @description        GET transport driver by ID
 *  @access             private
 */
router.get('/:driverId', [authMiddleware], async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const driver = await transportDriverService.getById({ driverId });
    res.send(driver);
});

/**
 *  @method             PATCH
 *  @description        Update an existing transport driver
 *  @access             private
 */
router.patch('/:driverId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const { name, phone, license_number, languages, is_active } = req.body;
    const updated = await transportDriverService.update(driverId, {
        name,
        phone,
        license_number,
        languages,
        is_active,
    });
    res.send(updated);
});

/**
 *  @method             DELETE
 *  @description        Delete a transport driver by ID
 *  @access             private
 */
router.delete('/:driverId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { driverId } = req.params;
    await transportDriverService.delete({ driverId });
    res.send({ success: true });
});

export default router;
