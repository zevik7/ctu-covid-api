import faker from '@faker-js/faker';
import getVaccineTypeModel from '#models/Vaccine_type.js';

export default async () => {
	// Remove all previous data
	await getVaccineTypeModel()
		.deleteMany({})
		.then((rs) => {
			console.log('Remove all previous vaccine types successful');
		});

	const vaccineTypes = [
		{
			name: 'Pfizer',
			country: 'United States',
		},
		{
			name: 'AstraZeneca',
			country: 'England',
		},
		{
			name: 'Moderna',
			country: 'United States',
		},
		{
			name: 'Sputnik V',
			country: 'Russian',
		},
		{
			name: 'Sinopharm',
			country: 'China',
		},
		{
			name: 'Janssen',
			country: 'Netherlands',
		},
		{
			name: 'Covaxin',
			country: 'Vietnam',
		},
	];

	await getVaccineTypeModel()
		.insertMany(vaccineTypes)
		.then(() => {
			console.log("Vaccine's type - seeding successful");
		});
};
