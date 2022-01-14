import SitesRouter from './sites.js';
import UserRouter from './user.js';

function route(app) {
	app.use('/', SitesRouter);

	app.use('/user', UserRouter);
}

export default route;
