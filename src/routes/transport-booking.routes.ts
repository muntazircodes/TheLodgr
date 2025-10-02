import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { TransportBookingService } from '../services/transport-booking.service';

const router = Router();
const transportBookingService = new TransportBookingService();

/**
 *  @method             GET
 *  @description        GET all transport bookings
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const bookings = await transportBookingService.getAll();
    res.send(bookings);
});

/**
 *  @method             GET
 *  @description        GET transport bookings by user ID
 *  @access             private
 */
router.get('/user/:userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;
    const bookings = await transportBookingService.getByUserId({ userId });
    res.send(bookings);
});

/**
 *  @method             GET
 *  @description        GET transport bookings by vehicle ID
 *  @access             private
 */
router.get('/vehicle/:vehicleId', [authMiddleware], async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const bookings = await transportBookingService.getByVehicleId({ vehicleId });
    res.send(bookings);
});

/**
 *  @method             POST
 *  @description        Create a new transport booking
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const {
        vehicle_id,
        user_id,
        package_id,
        driver_id,
        start_date,
        end_date,
        pickup_location,
        drop_location,
        total_price,
        status,
    } = req.body;
    const created = await transportBookingService.create({
        vehicle_id,
        user_id,
        package_id,
        driver_id,
        start_date,
        end_date,
        pickup_location,
        drop_location,
        total_price,
        status,
    });
    res.send(created);
});

/**
 *  @method             GET
 *  @description        GET transport booking by ID
 *  @access             private
 */
router.get('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const booking = await transportBookingService.getById({ bookingId });
    res.send(booking);
});

/**
 *  @method             PATCH
 *  @description        Update an existing transport booking
 *  @access             private
 */
router.patch('/:bookingId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const {
        vehicle_id,
        user_id,
        package_id,
        driver_id,
        start_date,
        end_date,
        pickup_location,
        drop_location,
        total_price,
        status,
    } = req.body;
    const updated = await transportBookingService.update(bookingId, {
        vehicle_id,
        user_id,
        package_id,
        driver_id,
        start_date,
        end_date,
        pickup_location,
        drop_location,
        total_price,
        status,
    });
    res.send(updated);
});

/**
 *  @method             DELETE
 *  @description        Delete a transport booking by ID
 *  @access             private
 */
router.delete('/:bookingId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    await transportBookingService.delete({ bookingId });
    res.send({ success: true });
});

export default router;
