import joi from 'joi';

const name = 'users';

const schema = joi.object({
	username: joi.string().alphanum().min(3).max(30),

	password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

	access_token: [joi.string(), joi.number()],
});
