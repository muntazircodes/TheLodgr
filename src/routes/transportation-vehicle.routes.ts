import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { TransportVehicleService } from '../services/transportation-vehicle.service';

const router = Router();
const transportVehicleService = new TransportVehicleService();

/**
 *  @method             GET
 *  @description        GET all transport vehicles
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const vehicles = await transportVehicleService.getAll();
    res.send(vehicles);
});

/**
 *  @method             POST
 *  @description        Create a new transport vehicle
 *  @access             private
 */
router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { name, type, brand, model, license_plate, capacity, features, image_url, base_price, price_per_km } =
        req.body;
    const created = await transportVehicleService.create({
        name,
        type,
        brand,
        model,
        license_plate,
        capacity,
        features,
        image_url,
        base_price,
        price_per_km,
    });
    res.send(created);
});

/**
 *  @method             GET
 *  @description        GET transport vehicle by ID
 *  @access             private
 */
router.get('/:vehicleId', [authMiddleware], async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const vehicle = await transportVehicleService.getById({ vehicleId });
    res.send(vehicle);
});

/**
 *  @method             PATCH
 *  @description        Update an existing transport vehicle
 *  @access             private
 */
router.patch('/:vehicleId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const {
        name,
        type,
        brand,
        model,
        license_plate,
        capacity,
        features,
        image_url,
        base_price,
        price_per_km,
        is_active,
    } = req.body;
    const updated = await transportVehicleService.update(vehicleId, {
        name,
        type,
        brand,
        model,
        license_plate,
        capacity,
        features,
        image_url,
        base_price,
        price_per_km,
        is_active,
    });
    res.send(updated);
});

/**
 *  @method             DELETE
 *  @description        Delete a transport vehicle by ID
 *  @access             private
 */
router.delete('/:vehicleId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    await transportVehicleService.delete({ vehicleId });
    res.send({ success: true });
});

export default router;
