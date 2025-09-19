import { Request, Response, Router } from 'express';

const router = Router();

/**
 *  @method             GET
 *  @description        the health endpoint check
 *  @access             public
 */
router.get('/',(req: Request, res: Response) => {
    res.sendStatus(200);
});

export default router;
