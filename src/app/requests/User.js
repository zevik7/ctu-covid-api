import Joi from 'joi';

// schema options
const options = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true, // remove unknown props
};

const create = (data) => {
	// create schema object
	const schema = Joi.object({
		name: Joi.string().required(),
		birthday: Joi.date().required(),
		gender: Joi.valid('Nam', 'Nữ').required(),
		contact: {
			email: Joi.string().email().required(),
			phone: Joi.string().required(),
			address: Joi.string().required(),
		},
		username: Joi.string().string(),
		password: Joi.string().min(6),
		avatar: Joi.string(),
		role: Joi.string().valid('admin', 'user').required(),
	});

	// validate request body against schema
	const validationResult = schema.validate(data, options);

	return validationResult;
};

const update = (data) => {
	// create schema object
	const schema = Joi.object({
		name: Joi.string(),
		birthday: Joi.date(),
		gender: Joi.valid('Nam', 'Nữ'),
		contact: {
			email: Joi.string().email(),
			phone: Joi.string(),
			address: Joi.string(),
		},
		username: Joi.string().string(),
		password: Joi.string().min(6),
		avatar: Joi.string(),
		role: Joi.string().valid('admin', 'user'),
		tot_vaccinations: Joi.number(),
		tot_heath_declaration: Joi.number(),
		tot_location: Joi.number(),
	});

	// validate request body against schema
	const validationResult = schema.validate(data, options);

	return validationResult;
};

export default { create, update };
