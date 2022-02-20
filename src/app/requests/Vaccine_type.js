import Joi from 'joi';

const create = (data) => {
	// create schema object
	const schema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string(),
		country: Joi.string.require(),
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
