import express from 'express';
import SitesRouter from './sites.js';
import UserRouter from './user.js';
import AuthRouter from './auth.js';
import handleResponse from '#middlewares/handleResponse.js';
import handleError from '#middlewares/handleError.js';
import authMiddleware from '#middlewares/auth.js';

const router = express.Router();

// Custom response
router.use(handleResponse);

router.use('/', SitesRouter);

router.use('/user', authMiddleware, UserRouter);

router.use('/admin/auth', AuthRouter);

// Custom handle error
// router.use(handleError);

export default router;
