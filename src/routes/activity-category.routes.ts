import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import haveAccess from '../middlewares/have-access.middleware';
import { ActivityCategoryService } from '../services/activity-categories.service';

const router = Router();
const activityCategoryService = new ActivityCategoryService();

/**
 *  @method             GET
 *  @description        GET all activity categories
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const categories = await activityCategoryService.getAll();
    res.send(categories);
});

/**
 *  @method             POST
 *  @description        Create a new activity category
 *  @access             private
 */
router.post('/', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { name, description, icon } = req.body;
    const category = await activityCategoryService.create({ name, description, icon });
    res.send(category);
});

/**
 *  @method             GET
 *  @description        GET activity category by ID
 *  @access             private
 */
router.get('/:categoryId', [authMiddleware], async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = await activityCategoryService.getById({ categoryId });
    res.send(category);
});

/**
 *  @method             PATCH
 *  @description        Update activity category by ID
 *  @access             private
 */
router.patch('/:categoryId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { name, description, icon } = req.body;
    const category = await activityCategoryService.update(categoryId, { name, description, icon });
    res.send(category);
});

/**
 *  @method             DELETE
 *  @description        Delete activity category by ID
 *  @access             private
 */
router.delete('/:categoryId', [authMiddleware, haveAccess], async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = await activityCategoryService.delete({ categoryId });
    res.send(category);
});

export default router;
