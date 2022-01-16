import { getDB } from '#database/mongodb.js';

const name = 'users';

async function create(data) {
	let { insertedId } = await getDB().collection(name).insertOne(data);
	return insertedId;
}

export default {
	create,
};
