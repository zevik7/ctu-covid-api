import Joi from 'joi';

const create = (data) => {
	// create schema object
	const schema = Joi.object({
		qr: Joi.string().required(),
		address: Joi.string().required(),
		create_by: Joi.string().required(),
		total_declaration: Joi.number(),
	});

	// schema options
	const options = {
		abortEarly: false, // include all errors
		allowUnknown: true, // ignore unknown props
		stripUnknown: true, // remove unknown props
	};

	// validate request body against schema
	const { error, value } = schema.validate(data, options);

	return error;
};

export default { create };
