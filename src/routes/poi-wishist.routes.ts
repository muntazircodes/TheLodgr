import { Request, Response, Router } from 'express';
import { PoiWishlistService } from '../services/poi-wishlist.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const poiWishlistService = new PoiWishlistService();
const router = Router({ mergeParams: true });

/**
 *  @method             GET
 *  @description        GET all the poi wishlist
 *  @access             private
 */

router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const { poiId } = req.params;
    const poiWishlist = await poiWishlistService.getAll({ poiId });
    res.send(poiWishlist);
});

/**
 *  @method             POST
 *  @description        Create the wishlist
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { poiId } = req.params;
    const poiWishlist = await poiWishlistService.create({ user_id: userId, poi_id: poiId });
    res.send(poiWishlist);
});

/**
 *  @method             GET
 *  @description        GET wishlist by Id
 *  @access             private
 */

router.get('/:wishlistId', [authMiddleware], async (req: Request, res: Response) => {
    const { wishlistId } = req.params;
    const poiWishlist = await poiWishlistService.getById({ wishlistId });
    res.send(poiWishlist);
});

/**
 *  @method             DELETE
 *  @description        Delete the wihslist
 *  @access             private
 */

router.delete('/:wishlistId', [authMiddleware], async (req: Request, res: Response) => {
    const { wishlistId } = req.params;
    const poiWishlist = await poiWishlistService.delete({ wishlistId });
    res.send(poiWishlist);
});

export default router;
