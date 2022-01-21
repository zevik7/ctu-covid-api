import express from 'express';
import controller from '#controllers/user.js';

const router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
// 	console.log('Time: ', Date.now().toLocaleString());
// 	console.log('----UserController----');
// 	next();
// });

router.get('/', controller.index);

router.post('/', controller.store);

router.get('/:id', controller.show);

router.put('/user/:id', controller.update);

router.delete('/user/:id', controller.destroy);

export default router;
