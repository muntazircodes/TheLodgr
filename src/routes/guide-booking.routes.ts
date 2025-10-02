///<reference path="../types/express.d.ts" />

import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { GuideBookingService } from '../services/guide-booking.service';

const guideBookingService = new GuideBookingService();
const router = Router();

/**
 *  @method             GET
 *  @description        GET all guide bookings
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const bookings = await guideBookingService.getAllBookings();
    res.send(bookings);
});

/**
 *  @method             POST
 *  @description        Create new guide booking
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { guide_id, user_id, package_id, poi_id, start_date, end_date, group_size, total_price, status } = req.body;

    const { data } = await guideBookingService.create({
        guide_id,
        user_id,
        package_id,
        poi_id,
        start_date,
        end_date,
        group_size,
        total_price,
        status,
    });

    res.send(data);
});

/**
 *  @method             GET
 *  @description        GET guide booking by ID
 *  @access             private
 */
router.get('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const booking = await guideBookingService.getById({ bookingId });
    res.send(booking);
});

/**
 *  @method             PATCH
 *  @description        Update existing guide booking
 *  @access             private
 */
router.patch('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    const { guide_id, user_id, package_id, poi_id, start_date, end_date, group_size, total_price, status } = req.body;

    const updatedBooking = await guideBookingService.update(bookingId, {
        guide_id,
        user_id,
        package_id,
        poi_id,
        start_date,
        end_date,
        group_size,
        total_price,
        status,
    });

    res.send(updatedBooking);
});

/**
 *  @method             DELETE
 *  @description        Delete existing guide booking
 *  @access             private
 */
router.delete('/:bookingId', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const deletedBooking = await guideBookingService.delete({ bookingId });
    res.send(deletedBooking);
});

/**
 *  @method             GET
 *  @description        GET guide bookings by user ID
 *  @access             private
 */
router.get('/user/:userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;
    const bookings = await guideBookingService.getByUserId({ userId });
    res.send(bookings);
});

/**
 *  @method             GET
 *  @description        GET guide bookings by guide ID
 *  @access             private
 */
router.get('/guide/:guideId', [authMiddleware], async (req: Request, res: Response) => {
    const { guideId } = req.params;
    const bookings = await guideBookingService.getByGuideId({ guideId });
    res.send(bookings);
});

/**
 *  @method             PATCH
 *  @description        Update guide booking status
 *  @access             private
 */
router.patch('/:bookingId/status', [authMiddleware], async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updatedBooking = await guideBookingService.updateStatus({ bookingId, status });
    res.send(updatedBooking);
});

export default router;
