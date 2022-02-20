import getVaccinaModel from '#models/Vaccination.js';
import VaccinaRequest from '#requests/Vaccination.js';
import { ObjectId } from 'mongodb';

class VaccinationController {
	// [GET] /user
	index(req, res, next) {
		const pageNum = req.query.page;

		getVaccinaModel()
			.find({
				deleted: false,
			})
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
		getVaccinaModel()
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
		const validation = VaccinaRequest.create(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getVaccinaModel()
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
		const validation = VaccinaRequest.update(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getVaccinaModel()
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
		getVaccinaModel()
			.deleteOne({ _id: req.params.id })
			.then((rs) => {
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}
}

export default new VaccinationController();
