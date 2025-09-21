import { Request, Response, Router } from 'express';
import { PoiCategoryService } from '../services/poi-categories.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const poiCategoryService = new PoiCategoryService();
const router = Router();

/**
 *  @method             GET
 *  @description        GET all the poi_categories
 *  @access             private
 */

router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const poiCategories = await poiCategoryService.getAll();
    res.send(poiCategories);
});

/**
 *  @method             POST
 *  @description        Cretae the POI category
 *  @access             private
 */

router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { name, icon, description } = req.body;
    const poiCategories = await poiCategoryService.create({ name, icon, description });
    res.send(poiCategories);
});

/**
 *  @method             GET
 *  @description        GET Poi Categoy by Id
 *  @access             private
 */

router.get('/:poiCategoryId', [authMiddleware], async (req: Request, res: Response) => {
    const { poiCategoryId } = req.params;
    const poiCategories = await poiCategoryService.getById({ poiCategoryId });
    res.send(poiCategories);
});
/**
 *  @method             PATCH
 *  @description        Update the POI category
 *  @access             private
 */

router.patch('/:poiCategoryId', [authMiddleware], async (req: Request, res: Response) => {
    const { poiCategoryId } = req.params;
    const { name, icon, description } = req.body;
    const poiCategories = await poiCategoryService.update(poiCategoryId, { name, icon, description });
    res.send(poiCategories);
});

/**
 *  @method             Delete
 *  @description        Delete Poi Categoy
 *  @access             private
 */

router.get('/:poiCategoryId', [authMiddleware], async (req: Request, res: Response) => {
    const { poiCategoryId } = req.params;
    const poiCategories = await poiCategoryService.delete({ poiCategoryId });
    res.send(poiCategories);
});

export default router;
