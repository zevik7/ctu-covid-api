import faker from '@faker-js/faker'
import getLocationModel from '#models/Location.js'
import getUserModel from '#models/User.js'

export default async () => {
  // Remove all previous data
  await getLocationModel()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous locations successful')
    })

  const admin = await getUserModel().findOne({ role: 'admin' })

  const names = ['101 Nhà học C1', '202 Nhà học C1', 'Căn tin Khoa CNTT&TT']

  let locations = []

  for (let i = 0; i < names.length; i++) {
    const created_at = new Date()
    const updated_at = new Date()

    locations.push({
      name: names[i],
      created_by: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
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
