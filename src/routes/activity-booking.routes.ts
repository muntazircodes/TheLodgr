///<reference path="../types/express.d.ts" />

import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ActivityBookingService } from '../services/activity-bookings.service';

const activityBookingService = new ActivityBookingService();
const router = Router();

/**
 *  @method             GET
 *  @description        GET all activity bookings (optionally filter by activityId via query)
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const activityId = req.query.activityId as string | undefined;
    const bookings = await activityBookingService.getAll({ activityId });
    res.send(bookings);
});

/**
 *  @method             POST
 *  @description        Create activity booking
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { activity_id, user_id, package_id, booking_date, participants, total_price, status } = req.body;

    const booking = await activityBookingService.create({
        activity_id,
        user_id,
        package_id,
        booking_date,
        participants,
        total_price,
        status,
    });

    res.send(booking);
});

/**
 *  @method             GET
 *  @description        GET activity booking by ID
 *  @access             private
 */
router.get('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const booking = await activityBookingService.getById({ bookingId });
    res.send(booking);
});

/**
 *  @method             PATCH
 *  @description        Update activity booking
 *  @access             private
 */
router.patch('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { package_id, booking_date, participants, total_price, status } = req.body;

    const booking = await activityBookingService.update(bookingId, {
        package_id,
        booking_date,
        participants,
        total_price,
        status,
    });

    res.send(booking);
});

/**
 *  @method             DELETE
 *  @description        Delete activity booking
 *  @access             private
 */
router.delete('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const booking = await activityBookingService.delete({ bookingId });
    res.send(booking);
});

/**
 *  @method             PATCH
 *  @description        Update activity booking status
 *  @access             private
 */
router.patch('/:bookingId/status', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await activityBookingService.updateStatus({ bookingId, status });
    res.send(booking);
});

export default router;
