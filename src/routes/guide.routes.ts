///<reference path="../types/express.d.ts" />

import { Request, Response, Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { GuideService } from '../services/guide.service';

const guideService = new GuideService();
const router = Router();

/**
 *  @method             GET
 *  @description        GET all guides
 *  @access             private
 */
router.get('/', [authMiddleware], async (req: Request, res: Response) => {
    const guides = await guideService.getAllGuides();
    res.send(guides);
});

/**
 *  @method             POST
 *  @description        Create new guide
 *  @access             private
 */
router.post('/', [authMiddleware], async (req: Request, res: Response) => {
    const { name, phone, email, license_number, languages, specialties, is_active } = req.body;

    const { data } = await guideService.create({
        name,
        phone,
        email,
        license_number,
        languages,
        specialties,
        is_active,
    });

    res.send(data);
});

/**
 *  @method             GET
 *  @description        GET guide by ID
 *  @access             private
 */
router.get('/:guideId', [authMiddleware], async (req: Request, res: Response) => {
    const { guideId } = req.params;
    const guide = await guideService.getById({ guideId });
    res.send(guide);
});

/**
 *  @method             PATCH
 *  @description        Update existing guide
 *  @access             private
 */
router.patch('/:guideId', [authMiddleware], async (req: Request, res: Response) => {
    const { guideId } = req.params;

    const { name, phone, email, license_number, languages, specialties, is_active } = req.body;

    const updatedGuide = await guideService.update(guideId, {
        name,
        phone,
        email,
        license_number,
        languages,
        specialties,
        is_active,
    });

    res.send(updatedGuide);
});

/**
 *  @method             DELETE
 *  @description        Delete existing guide
 *  @access             private
 */
router.delete('/:guideId', [authMiddleware], async (req: Request, res: Response) => {
    const { guideId } = req.params;
    const deletedGuide = await guideService.delete({ guideId });
    res.send(deletedGuide);
});

/**
 *  @method             GET
 *  @description        GET guides by specialty
 *  @access             private
 */
router.get('/specialty/:specialty', [authMiddleware], async (req: Request, res: Response) => {
    const { specialty } = req.params;
    const guides = await guideService.getBySpecialty({ specialty });
    res.send(guides);
});

/**
 *  @method             GET
 *  @description        GET guides by language
 *  @access             private
 */
router.get('/language/:language', [authMiddleware], async (req: Request, res: Response) => {
    const { language } = req.params;
    const guides = await guideService.getByLanguage({ language });
    res.send(guides);
});

export default router;
