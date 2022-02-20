import faker from '@faker-js/faker';
import getVaccineTypeModel from '#models/Vaccine_type.js';

export default async () => {
	// Remove all previous data
	await getVaccineTypeModel()
		.deleteMany({})
		.then((rs) => {
			console.log('Remove all previous vaccine types successful');
		});

	let vaccineTypes = [
		{
			name: 'Pfizer',
			description: '',
			country: 'United States',
		},
		{
			name: 'AstraZeneca',
			description: '',
			country: 'England',
		},
		{
			name: 'Moderna',
			description: '',
			country: 'United States',
		},
		{
			name: 'Sputnik V',
			description: '',
			country: 'Russian',
		},
		{
			name: 'Sinopharm',
			description: '',
			country: 'China',
		},
		{
			name: 'Janssen',
			description: '',
			country: 'Netherlands',
		},
		{
			name: 'Covaxin',
			description: '',
			country: 'Vietnam',
		},
	];

	// Assign timestamp
	vaccineTypes = vaccineTypes.map((element, index) => {
		return {
			...element,
			created_at: new Date(),
			updated_at: new Date(),
		};
	});

	await getVaccineTypeModel()
		.insertMany(vaccineTypes)
		.then(() => {
			console.log("Vaccine's type - seeding successful");
		});
};
