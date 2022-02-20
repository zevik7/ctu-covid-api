import getUserModel from '#models/User.js';
import UserRequest from '#requests/User.js';
import { ObjectId } from 'mongodb';

class UserController {
	// [GET] /user
	index(req, res, next) {
		const pageNum = req.query.page;

		getUserModel()
			.find()
			.sort()
			.limit(5)
			.skip(pageNum > 0 ? (pageNum - 1) * 5 : 0)
			.toArray()
			.then((result) => {
				res.success({
					data: result,
				});
			});
	}

	// [GET] /user/:id
	show(req, res, next) {
		getUserModel()
			.findOne({
				_id: ObjectId(req.params.id),
			})
			.then((result) => {
				res.success({
					result,
				});
			});
	}

	// [POST] /user
	store(req, res, next) {
		// Validation
		const validation = UserRequest.create(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getUserModel()
			.insertOne({
				...validation.value,
				created_at: Date.now,
				updated_at: Date.now,
				deleted: false,
			})
			.then((rs) => {
				return res.json({
					status: 'success',
					data: rs,
				});
			});
	}

	//[PUT] /user/:id
	update(req, res, next) {
		// Validation
		const validation = UserRequest.update(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getUserModel()
			.updateOne(
				{
					_id: ObjectId(req.params.id),
				},
				{
					$set: validation.value,
					$currentDate: { updated_at: true },
				}
			)
			.then((rs) => {
				res.status(200);
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}

	// [DELETE] /user/:id
	destroy(req, res, next) {
		getUserModel()
			.deleteOne({ _id: req.params.id })
			.then((rs) => {
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}
}

export default new UserController();
