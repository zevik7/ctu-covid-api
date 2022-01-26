import faker from '@faker-js/faker';
import getUserModel from '#models/user.js';
import removeVieTones from '#utilities/removeVieTones.js';
import bcrypt from 'bcryptjs';

export default async () => {
	faker.locale = 'vi';

	// Remove all previous data
	await getUserModel()
		.deleteMany({})
		.then((rs) => {
			console.log('Remove all previous users successful');
		});

	let users = [
		{
			name: 'Nguyen Huu Thien Phu',
			birthday: '03-15-2000',
			gender: 'Nam',
			contact: {
				email: 'phub1805805@gmail.com',
				phone: '0898008388',
				address: 'Hau Giang',
			},
			username: 'admin',
			password: bcrypt.hashSync('admin'),
			avatar: '/images/default_avatar.jpeg',
			role: 'admin',
		},
	];

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
			created_at: Date.now(),
			updated_at: Date.now(),
		});
	}

	await getUserModel()
		.insertMany(users)
		.then((rs) => {
			console.log('User - seeding successful');
		});
};
