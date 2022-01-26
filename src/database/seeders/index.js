import { connectDB } from '#database/mongodb.js';
import userSeeder from './user.js';
import vaccinationSeeder from './vaccination.js';
import vaccine_typeSeeder from './vaccine_type.js';

// Init app
connectDB().then(seedDB);

async function seedDB() {
	await userSeeder(100);

	await vaccine_typeSeeder();

	await vaccinationSeeder(200);
}
