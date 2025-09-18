import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();
const authService = new AuthService();

/**
 *  @method             POST
 *  @description        Authenticate using username/email and password
 *  @access             public
 */
router.post('/signup', async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;
    const user = await authService.signUp({ email, password, name, phone });
    res.send(user);
});

/**
 *  @method             POST
 *  @description        login using username/email and password
 *  @access             public
 */
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const session = await authService.login({ email, password });
    res.send(session);
});

export default router;
