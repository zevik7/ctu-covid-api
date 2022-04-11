import faker from '@faker-js/faker'
import getUserModel from '#models/User.js'
import removeVieTones from '#utilities/removeVieTones.js'
import bcrypt from 'bcryptjs'
import RandExp from 'randexp'

export default async (count) => {
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
      email: 'phub1805805@gmail.com',
      phone: '0898007389',
      address: 'Hau Giang',
      username: 'admin',
      password: bcrypt.hashSync('admin'),
      avatar: '/images/default_avatar.jpeg',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const phoneRegex =
    /0(3[2-9]|5[689]|7(0|[6-9])|8([0-6]|8|9)|9([0-4]|[6-9]))[0-9]{7}$/

  for (let i = 0; i < count; i++) {
    const name = faker.name.findName() // full name
    const firstName = removeVieTones(name)
    const birthday = faker.date.between('03-15-1995', '03-15-2003')
    const gender = faker.random.arrayElement(['Nam', 'Nữ'])
    const email = firstName.split(' ').at(-1) + i + '@student.ctu.edu.vn'
    const phone = new RandExp(phoneRegex).gen()
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
