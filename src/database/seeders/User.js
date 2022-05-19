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

  // Data for demo
  let users = [
    {
      name: 'Admin',
      birthday: new Date('03-15-2000'),
      gender: 'Nam',
      email: 'admin@ctu.covid.vn',
      phone: '0706878787',
      address: 'Hậu Giang',
      username: 'admin',
      password: bcrypt.hashSync('123123'),
      avatar: '/images/default_avatar.jpeg',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Hồ Trung Nhân',
      birthday: new Date('10-30-2000'),
      gender: 'Nam',
      email: 'nhan1805898@student.ctu.edu.vn',
      phone: '0774000828',
      address: 'Hậu Giang',
      avatar: '/images/default_avatar.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Lê Văn Hảo',
      birthday: new Date('10-24-2000'),
      gender: 'Nam',
      email: 'haob1805797@student.ctu.edu.vn',
      phone: '0898108148',
      address: 'Tri Tôn, An Giang',
      avatar: '/images/default_avatar.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Võ Văn Khánh',
      birthday: new Date('3-21-2000'),
      gender: 'Nam',
      email: 'khanhb1805598@student.ctu.edu.vn',
      phone: '0898001148',
      address: 'Sóc Trăng',
      avatar: '/images/default_avatar.jpeg',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Nguyễn Bảo Long',
      birthday: new Date('3-21-2000'),
      gender: 'Nam',
      email: 'longb1805899@student.ctu.edu.vn',
      phone: '0774001788',
      address: 'An Giang',
      avatar: '/images/default_avatar.jpeg',
      role: 'user',
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
