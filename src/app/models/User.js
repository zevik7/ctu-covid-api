import { getDB } from '#database/Mongodb.js';

const name = 'users';

export default () => {
	const dbInstance = getDB();
	const User = dbInstance.collection(name);

	return User;
};
