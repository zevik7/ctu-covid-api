import faker from '@faker-js/faker';
import getVaccinationModel from '#models/vaccination.js';
import getVaccineTypeModel from '#models/vaccine_type.js';
import getUserModel from '#models/user.js';

export default async (qty) => {
	// Remove all previous data
	await getVaccinationModel()
		.deleteMany({})
		.then((rs) => {
			console.log('Remove all previous vaccinations successful');
		});

	const userIds = await getUserModel().find({}).project({ _id: 1 }).toArray();

	const vaccineTypeIds = await getVaccineTypeModel()
		.find({})
		.project({ _id: 1 })
		.toArray();

	const vaccinations = [];

	for (let i = 0; i < qty; i++) {
		const user_id = faker.random.arrayElement(userIds)._id;
		const vaccine_type_id = faker.random.arrayElement(vaccineTypeIds)._id;
		const injection_date = faker.date.between('11-1-2021', '5-1-2022');
		const images = [
			{
				url: '/images/vaccination_proof.jpg',
				desc: 'none',
			},
		];

		vaccinations.push({
			user_id,
			vaccine_type_id,
			injection_date,
			images,
		});
	}

	await getVaccinationModel()
		.insertMany(vaccinations)
		.then((rs) => {
			console.log('User - seeding successful');
		});
};
