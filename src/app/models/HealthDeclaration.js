import { getDB } from '#database/Mongodb.js';

const name = 'health_declarations';

export default () => {
	const dbInstance = getDB();
	const HealthDeclaration = dbInstance.collection(name);

	return HealthDeclaration;
};
