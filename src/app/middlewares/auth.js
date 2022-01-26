import jwt from 'jsonwebtoken';

export default (req, res, next) => {
	const token = req.header.token;

	if (!token) return res.unauth({});

	const accessToken = token.split(' ')[1];

	jwt.verify(accessToken, process.env.JWT_ACESS_KEY, (err, user) => {
		if (err)
			return res.forbidden({
				message: 'Token is not valid',
			});

		req.user = user;
		next();
	});
};
