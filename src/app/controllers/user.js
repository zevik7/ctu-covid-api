import UserModel from '#models/user.js';
import UserRequest from '#requests/user.js';

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
