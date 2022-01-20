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

router.get('/:id', controller.show);

router.post('/', controller.store);

export default router;
