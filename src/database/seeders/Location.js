import faker from '@faker-js/faker'
import getLocationModel from '#models/Location.js'
import getUserModel from '#models/User.js'

export default async (qty) => {
  // Remove all previous data
  await getLocationModel()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous locations successful')
    })

  const userIds = await getUserModel().find({}).project({ _id: 1 }).toArray()

  const locations = []

  for (let i = 0; i < qty; i++) {
    const qr_code = ''
    const created_by = faker.random.arrayElement(userIds)._id
    const address = ''
    const created_at = new Date()
    const updated_at = new Date()

    locations.push({
      qr_code,
      address,
      created_by,
      created_at,
      updated_at,
    })
  }

  await getLocationModel()
    .insertMany(locations)
    .then((rs) => {
      console.log('Location - seeding successful')
    })
}
