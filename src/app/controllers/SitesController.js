import User from '#models/User.js';

class SitesController {
	// [GET]
	index(req, res, next) {
		User.create({
			name: 'Ho Nguyen Phuong Vy',
			age: 21,
		}).then((rs) => {
			res.json(rs);
		});
	}
}

export default new SitesController();
