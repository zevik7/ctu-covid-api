import Joi from 'joi';

const create = (data) => {
	// create schema object
	const schema = Joi.object({
		name: Joi.string().required(),
		birthday: Joi.date().required().messages({
			'string.base': `"a" should be a type of 'text'`,
			'string.empty': `"a" cannot be an empty field`,
			'string.min': `"a" should have a minimum length of {#limit}`,
			'any.required': `Yeeu cau truong nay`,
		}),
		gender: Joi.valid('Nam', 'Nữ').required(),
		contact: {
			email: Joi.string().email().required(),
			phone: Joi.string().required(),
			address: Joi.string().required(),
		},
		username: Joi.string().email(),
		password: Joi.string().min(6),
		role: Joi.string().valid('admin', 'user').required(),
		tot_vaccinations: Joi.number(),
		tot_heath_declaration: Joi.number(),
		tot_location: Joi.number(),
	});

	// schema options
	const options = {
		abortEarly: false, // include all errors
		allowUnknown: true, // ignore unknown props
		stripUnknown: true, // remove unknown props
	};

	// validate request body against schema
	const validationResult = schema.validate(data, options);

	return validationResult;
};

export default { create };
