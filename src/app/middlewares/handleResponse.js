export default (req, res, next) => {
	/**
	 * Success response
	 */
	res.success = ({
		data = {},
		code = 200,
		status = 'success',
		message = '',
	}) => {
		return res.status(code).json({
			status,
			message,
			data,
		});
	};

	/**
	 * Custom error response
	 */

	res.error = ({ errors = {}, code = 400, status = 'error', message = '' }) => {
		return res.status(code).json({
			status,
			message,
			errors,
		});
	};

	/**
	 * Bad request response
	 * (status 400)
	 * The server could not understand the request due to invalid syntax.
	 */

	res.badreq = ({ errors = {}, code = 400, message = 'Bad request' }) => {
		return res.error({ errors, code, message });
	};

	/**
	 * Unauthorize request response
	 * (status 401)
	 */

	res.unauth = ({ errors = {}, code = 401, message = 'Unauthorize' }) => {
		return res.error({ errors, code, message });
	};

	/**
	 * Forbidden request response
	 * (status 403)
	 * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
	 */

	res.forbidden = ({ errors = {}, code = 403, message = 'Forbidden' }) =>
		res.error({ errors, code, message });

	/**
	 * (status 500)
	 * Internal request response
	 */

	res.internal = ({ errors = {}, code = 401, message = '' }) =>
		res.error({ errors, code, message });

	next();
};
