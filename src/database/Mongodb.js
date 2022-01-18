import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
let dbInstance = null;

export const connectDB = async () => {
	try {
		await client.connect();
		// Assign clientDB to our dbInstance
		dbInstance = client.db(process.env.DB_NAME);
		console.log('Database connection successful');
	} catch (err) {
		console.log('Database connection unsuccessful');
		console.log(err);
	}
};

export const getDB = () => {
	return dbInstance;
};
