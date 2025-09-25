import { Request, Response, Router } from 'express';
import { PriceService } from '../services/price.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const priceService = new PriceService();
const router = Router();

/**
 *  @method             GET
 *  @description        GET all the prices
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const prices = await priceService.getAll();
    res.send(prices);
});

/**
 *  @method             GET
 *  @description        GET price by ID
 *  @access             private
 */
router.get('/:priceId', [authMiddleware], async (req: Request, res: Response) => {
    const { priceId } = req.params;
    const price = await priceService.getById({ priceId });
    res.send(price);
});

/**
 *  @method             POST
 *  @description        Create a price
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { entity_type, entity_id, price, tier, effective_from, effective_to } = req.body;
    const prices = await priceService.create({
        entity_type,
        entity_id,
        price,
        tier,
        effective_from,
        effective_to,
    });
    res.send(prices);
});

/**
 *  @method             PATCH
 *  @description        Update a price by ID
 *  @access             private
 */
router.patch('/:priceId', [authMiddleware], async (req: Request, res: Response) => {
    const { priceId } = req.params;
    const update = req.body;
    const price = await priceService.update({ priceId, update });
    res.send(price);
});

/**
 *  @method             DELETE
 *  @description        Delete a price by ID
 *  @access             private
 */
router.delete('/:priceId', [authMiddleware], async (req: Request, res: Response) => {
    const { priceId } = req.params;
    const result = await priceService.delete({ priceId });
    res.send(result);
});

export default router;
