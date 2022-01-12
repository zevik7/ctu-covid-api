import { MongoClient } from 'mongodb';

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

export const connectDB = async () => {
	try {
		await client.connect();
		console.log('Database connection successful');
	} catch (err) {
		console.log('Database connection unsuccessful');
		console.log(err);
	} finally {
		await client.close();
	}
};
