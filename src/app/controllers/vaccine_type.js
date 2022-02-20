import getVaccine_typeModel from '#models/Vaccine_type.js';
import Vaccine_typeRequest from '#requests/Vaccine_type.js';
import { ObjectId } from 'mongodb';

class VaccinationController {
	// [GET] /user
	index(req, res, next) {
		const pageNum = req.query.page;

		getVaccine_typeModel()
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
		getVaccine_typeModel()
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
		const validation = Vaccine_typeRequest.create(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getVaccine_typeModel()
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
		const validation = Vaccine_typeRequest.update(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getVaccine_typeModel()
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
		getVaccine_typeModel()
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
