import getLocationModel from '#models/Location.js';
import LocationRequest from '#requests/Location.js';
import { ObjectId } from 'mongodb';

class LocationController {
	// [GET] /user
	index(req, res, next) {
		const pageNum = req.query.page;

		getLocationModel()
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
		getLocationModel()
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
		const validation = LocationRequest.create(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getLocationModel()
			.insertOne({
				...validation.value,
				create_at: Date.now,
				update_at: Date.now,
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
		const validation = LocationRequest.update(req.body);

		if (validation.error)
			return res.json({
				status: 'error',
				errors: validation.error.details,
			});

		getLocationModel()
			.updateOne(
				{
					_id: ObjectId(req.params.id),
				},
				{
					$set: validation.value,
					$currentDate: { update_at: true },
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
		getLocationModel()
			.deleteOne({ _id: req.params.id })
			.then((rs) => {
				res.json({
					status: 'success',
					data: rs,
				});
			});
	}
}

export default new LocationController();
