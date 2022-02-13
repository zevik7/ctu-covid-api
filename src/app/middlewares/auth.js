import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
	const token = req.headers.authorization;

	if (!token)
		return res.unauth({
			message: 'You are not authenticated',
		});

	const accessToken = token.split(' ')[1];

	jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
		if (err)
			return res.forbidden({
				message: 'Token is not valid',
			});

		req.user = user;
		next();
	});
};
