import getHealthDeclarationModel from '#models/Health_declaration.js';
import HealthDeclarationRequest from '#requests/Health_declaration.js';
import { ObjectId } from 'mongodb';

class HealthDeclarationController {
	// [GET] /user
	index(req, res, next) {
		const pageNum = req.query.page;

		getHealthDeclarationModel()
			.find({})
			.sort()
			.limit(5)
			.skip(pageNum > 0 ? (pageNum - 1) * 5 : 0)
			.toArray()
			.then((rs) => {
				res.status(200);
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}

	// [GET] /user/:id
	show(req, res, next) {
		getHealthDeclarationModel()
			.findOne({
				_id: ObjectId(req.params.id),
			})
			.then((rs) => {
				res.status(200);
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}

	// [POST] /user
	store(req, res, next) {
		// Validation
		const validation = HealthDeclarationRequest.create(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getHealthDeclarationModel()
			.insertOne({
				...validation.value,
				created_at: Date.now,
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
		const validation = HealthDeclarationRequest.update(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getHealthDeclarationModel()
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
		getHealthDeclarationModel()
			.deleteOne({ _id: req.params.id })
			.then((rs) => {
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}
}

export default new HealthDeclarationController();
