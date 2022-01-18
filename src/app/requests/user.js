import Joi from 'joi';

const create = (data) => {
	// create schema object
	const schema = Joi.object({
		title: Joi.string().required(),
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
		role: Joi.string().valid('Admin', 'User').required(),
	});

	// schema options
	const options = {
		abortEarly: false, // include all errors
		allowUnknown: true, // ignore unknown props
		stripUnknown: true, // remove unknown props
	};

	// validate request body against schema
	const { error, value } = schema.validate(data, options);
	// const rs = schema.validate(data, options);

	return error;
	// if (error) {
	//     // on fail return comma separated errors
	//     next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
	// } else {
	//     // on success replace req.body with validated value and trigger next middleware function
	//     req.body = value;
	//     next();
	// }
};

export default { create };
