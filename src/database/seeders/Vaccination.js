import faker from '@faker-js/faker'
import getVaccinationModel from '#models/Vaccination.js'
import getVaccineTypeModel from '#models/Vaccine_type.js'
import getUserModel from '#models/User.js'

export default async (qty) => {
  // Remove all previous data
  await getVaccinationModel()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous vaccinations successful')
    })

  const users = await getUserModel().find({}).toArray()

  const vaccineTypes = await getVaccineTypeModel().find({}).toArray()

  const vaccinations = []

  for (let i = 0; i < qty; i++) {
    const user = faker.random.arrayElement(users)
    const vaccine_type = faker.random.arrayElement(vaccineTypes)
    const injection_date = faker.date.between('11-1-2021', '5-1-2022')
    const images = [
      {
        url: '/images/vaccination_proof.jpg',
        desc: 'none',
      },
    ]

    vaccinations.push({
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
      images,
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  await getVaccinationModel()
    .insertMany(vaccinations)
    .then((rs) => {
      console.log('Vaccination - seeding successful')
    })
}
