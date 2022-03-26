import faker from '@faker-js/faker'
import getPositive_declarationModel from '#models/Positive_declaration.js'
import getUserModel from '#models/User.js'
import getLocationModel from '#models/Location.js'
import Chance from 'chance'

const chance = new Chance()

export default async (qty) => {
  // Remove all previous data
  await getPositive_declarationModel()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous Positive_declarations successful')
    })

  const users = await getUserModel().find({}).toArray()

  const locations = await getLocationModel().find({}).toArray()

  const positive_declarations = []

  for (let i = 0; i < qty; i++) {
    const user = faker.random.arrayElement(users)
    const location = faker.random.arrayElement(locations)
    const created_at = new Date()
    let start_date = faker.date.between('2022-02-01', '2022-03-20')
    let end_date = new Date(
      new Date(start_date).setDate(
        start_date.getDate() + faker.random.arrayElement([7, 8, 9, 10])
      )
    )

    positive_declarations.push({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      },
      location: {
        name: user.address,
        position: {
          lat: chance.floating({ min: 10.0308, max: 10.044 }),
          lng: chance.floating({ min: 105.7525, max: 105.784 }),
        },
      },
      severe_symptoms: Math.random() < 0.05 ? true : false,
      start_date,
      end_date,
      created_at,
    })
  }

  await getPositive_declarationModel()
    .insertMany(positive_declarations)
    .then((rs) => {
      console.log('Positive_declaration - seeding successful')
    })
}
