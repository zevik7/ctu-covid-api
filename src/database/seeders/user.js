import faker from '@faker-js/faker';
import getUserModel from '#models/user.js';
import removeVieTones from '#utilities/removeVieTones.js';

export default async () => {
	faker.locale = 'vi';

	// Remove all previous data
	await getUserModel()
		.deleteMany({})
		.then((rs) => {
			console.log('Remove all previous users successful');
		});

	let users = [];

	for (let i = 0; i < 100; i++) {
		const name = faker.name.findName(); // full name
		const firstName = removeVieTones(name);
		const birthday = faker.date.between('03-15-1995', '03-15-2003');
		const gender = faker.random.arrayElement(['Nam', 'Nữ']);
		const email = firstName.split(' ').at(-1) + '@student.ctu.edu.vn';
		const phone = faker.phone.phoneNumberFormat();
		const address = faker.address.city();
		users.push({
			name,
			birthday,
			gender,
			contact: {
				email,
				phone,
				address,
			},
			role: 'user',
		});
	}

	await getUserModel()
		.insertMany(users)
		.then((rs) => {
			console.log('User - seeding successful');
		});
};
