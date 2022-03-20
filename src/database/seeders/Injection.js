import faker from '@faker-js/faker'
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
    const injection_date = faker.date.between('11-1-2021', '5-1-2022')
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
      time: Math.ceil(Math.random() * 3),
      images,
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  await getInjection()
    .insertMany(injections)
    .then((rs) => {
      console.log('Injection - seeding successful')
    })
}
