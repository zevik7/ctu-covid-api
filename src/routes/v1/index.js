import express from 'express';
import SitesRouter from './sites.js';
import UserRouter from './user.js';

const router = express.Router();

router.use('/', SitesRouter);

router.use('/user', UserRouter);

export default router;
