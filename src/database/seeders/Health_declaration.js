import faker from '@faker-js/faker'
import getHealth_declarationModel from '#models/Health_declaration.js'
import getUserModel from '#models/User.js'
import getLocationModel from '#models/Location.js'

export default async (qty) => {
  // Remove all previous data
  await getHealth_declarationModel()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous Health_declarations successful')
    })

  const users = await getUserModel().find({}).toArray()

  const locations = await getLocationModel().find({}).toArray()

  const health_declarations = []

  for (let i = 0; i < qty; i++) {
    const user = faker.random.arrayElement(users)
    const location = faker.random.arrayElement(locations)
    const created_at = new Date()

    health_declarations.push({
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      },
      location: {
        _id: location._id,
        name: location.name,
      },
      status: {
        danger_area: false,
        symptom: false,
      },
      created_at,
    })
  }

  await getHealth_declarationModel()
    .insertMany(health_declarations)
    .then((rs) => {
      console.log('Health_declaration - seeding successful')
    })
}
