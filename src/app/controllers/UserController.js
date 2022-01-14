class UserController {
	// [GET]
	index(req, res, next) {
		res.json('user controller');
	}
}

export default new UserController();
