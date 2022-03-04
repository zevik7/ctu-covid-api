import faker from '@faker-js/faker'
import getUserModel from '#models/User.js'
import removeVieTones from '#utilities/removeVieTones.js'
import bcrypt from 'bcryptjs'

export default async () => {
  faker.locale = 'vi'

  // Remove all previous data
  await getUserModel()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous users successful')
    })

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
      created_at: Date.now,
      updated_at: Date.now,
    },
  ]

  for (let i = 0; i < 100; i++) {
    const name = faker.name.findName() // full name
    const firstName = removeVieTones(name)
    const birthday = faker.date.between('03-15-1995', '03-15-2003')
    const gender = faker.random.arrayElement(['Nam', 'Nữ'])
    const email = firstName.split(' ').at(-1) + '@student.ctu.edu.vn'
    const phone = faker.phone.phoneNumberFormat()
    const address = faker.address.city()
    const avatar = '/images/default_avatar.jpeg'
    users.push({
      name,
      birthday,
      gender,
      email,
      phone,
      address,
      role: 'user',
      avatar,
      tot_injection: 2,
      tot_declaration: 10,
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  await getUserModel()
    .insertMany(users)
    .then((rs) => {
      console.log('User - seeding successful')
    })
}
