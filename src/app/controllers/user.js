import getUserModel from '#models/user.js';
import UserRequest from '#requests/user.js';
import { ObjectId } from 'mongodb';

class UserController {
	// [GET] /user
	index(req, res, next) {
		getUserModel()
			.find({})
			.toArray()
			.then((rs) => {
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}

	// [GET] /user/:id
	show(req, res, next) {
		getUserModel()
			.findOne({
				_id: ObjectId(req.params.id),
			})
			.then((rs) => {
				res.json({
					status: 'success',
					data: rs,
				});
			});
		console.log(req.params.id);
	}

	//[POST]
	store(req, res, next) {
		// Validation
		const validation = UserRequest.create(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details.map((err) => {
					return {
						field: err.context.key,
						msg: err.message,
					};
				}),
			});

		getUserModel()
			.insertOne(req.body)
			.then((rs) => {
				return res.json({
					status: 'success',
					data: rs,
				});
			});
	}
}

export default new UserController();
