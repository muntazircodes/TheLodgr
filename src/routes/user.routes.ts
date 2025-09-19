import { Request, Response, Router } from 'express';
import { UserService } from '../services/user.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userService = new UserService();

/**
 *  @method             GET
 *  @description        GET all the users
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
 *  @description        GET the user by ID
 *  @access             private
 */

router.get('/:userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userProfile = await userService.getById({ userId: userId });
    res.send(userProfile);
});

/**
 *  @method             PATCH
 *  @description        Update the existing user
 *  @access             private
 */

router.patch('/:userId', [authMiddleware], async (req: Request, res: Response) => {
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

    const userProfile = await userService.update({
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
    res.send(userProfile);
});

/**
 *  @method             DELETE
 *  @description        Delete the existing user
 *  @access             private
 */

router.delete(':/userId', [authMiddleware], async (req: Request, res: Response) => {
    const { userId } = req.params;
    const userProfile = userService.delete({ userId });
    res.send(userProfile);
});

export default router;
