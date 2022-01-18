import { getDB } from '#database/mongodb.js';

const name = 'users';

export default () => {
	const dbInstance = getDB();
	const User = dbInstance.collection(name);

	return User;
};
