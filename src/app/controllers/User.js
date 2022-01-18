import UserModel from '#models/User.js';
import userRequest from '#requests/User.js';

class UserController {
	// [GET]
	async index(req, res, next) {
		UserModel()
			.find({})
			.toArray()
			.then((rs) => {
				res.json(rs);
			});
	}
}

export default new UserController();
