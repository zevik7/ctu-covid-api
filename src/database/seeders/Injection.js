import faker from '@faker-js/faker'
import dateFormat from 'dateformat'
import getInjection from '#models/Injection.js'
import getVaccineTypeModel from '#models/Vaccine_type.js'
import getUserModel from '#models/User.js'

export default async (qty) => {
  // Remove all previous data
  await getInjection()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous injections successful')
    })

  const users = await getUserModel().find({}).toArray()

  const vaccineTypes = await getVaccineTypeModel().find({}).toArray()

  const injections = []

  for (let i = 0; i < qty; i++) {
    const user = faker.random.arrayElement(users)
    const vaccine_type = faker.random.arrayElement(vaccineTypes)
    const created_at = new Date()
    const updated_at = new Date()
    const injection_date = faker.date.between(
      '2022-01-01',
      dateFormat(created_at)
    )
    const images = [
      {
        url: '/images/injection_proof.jpg',
        desc: 'none',
      },
      {
        url: '/images/injection_proof.jpg',
        desc: 'none',
      },
    ]
    // Caculate time
    const time = injections.reduce((pre, cur, i) => {
      if (cur.user._id === user._id) return pre + 1
    }, 1)

    injections.push({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
      vaccine_type: {
        _id: vaccine_type._id,
        name: vaccine_type.name,
      },
      injection_date,
      time,
      images,
      created_at,
      updated_at,
    })
  }

  await getInjection()
    .insertMany(injections)
    .then((rs) => {
      console.log('Injection - seeding successful')
    })
}
