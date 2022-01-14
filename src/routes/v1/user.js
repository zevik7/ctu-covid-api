import express from 'express';
import controller from '#controllers/UserController.js';

const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now().toLocaleString());
	console.log('----UserController----');
	next();
});

router.get('/', controller.index);

export default router;
