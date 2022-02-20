import express from 'express';
import controller from '#controllers/user.js';

const router = express.Router();

router.get('/', controller.index);

router.post('/', controller.store);

router.get('/:id', controller.show);

router.put('/user/:id', controller.update);

router.delete('/user/:id', controller.destroy);

export default router;
