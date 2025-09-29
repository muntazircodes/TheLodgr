///<reference path="../types/express.d.ts" />

import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';

const userService = new UserService();
const router = Router();

/**
 *  @method             GET
 *  @description        GET all users
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.send(users);
});

/**
 *  @method             POST
 *  @description        Create new user details
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const {
        name,
        profile,
        aadhaar_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        phone_primary,
        phone_alternate,
    } = req.body;

    const { data } = await userService.create({
        id: userId,
        name,
        profile,
        aadhaar_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        phone_primary,
        phone_alternate,
    });

    res.send(data);
});

/**
 *  @method             GET
 *  @description        GET user by ID
 *  @access             private
 */
router.get('/:userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userProfile = await userService.getById({ userId });
    res.send(userProfile);
});

/**
 *  @method             PATCH
 *  @description        Update existing user
 *  @access             private
 */
router.patch('/:userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;

    const {
        name,
        profile,
        aadhaar_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        phone_primary,
        phone_alternate,
    } = req.body;

    const updatedUser = await userService.update(userId, {
        name,
        profile,
        aadhaar_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        phone_primary,
        phone_alternate,
    });

    res.send(updatedUser);
});

/**
 *  @method             DELETE
 *  @description        Delete existing user
 *  @access             private
 */
router.delete('/:userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;
    const deletedUser = await userService.delete({ userId });
    res.send(deletedUser);
});

export default router;
