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

  const userIds = await getUserModel().find({}).project({ _id: 1 }).toArray()

  const locationIds = await getLocationModel()
    .find({})
    .project({ _id: 1 })
    .toArray()

  const health_declarations = []

  for (let i = 0; i < qty; i++) {
    const user_id = faker.random.arrayElement(userIds)._id
    const location_id = faker.random.arrayElement(locationIds)._id
    const created_at = new Date()

    health_declarations.push({
      user_id,
      location_id,
      created_at,
    })
  }

  await getHealth_declarationModel()
    .insertMany(health_declarations)
    .then((rs) => {
      console.log('Health_declaration - seeding successful')
    })
}
