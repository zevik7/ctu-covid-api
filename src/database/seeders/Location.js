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

  const locationsExample = [
    {
      name: 'Hội Trường rùa',
      latlng: { lat: 10.02929, lng: 105.76944 },
    },
    {
      name: 'Phòng 202 Nhà học C1',
      latlng: { lat: 10.03058, lng: 105.76991 },
    },
    {
      name: 'Căn tin Khoa CNTT&TT',
      latlng: { lat: 10.03139, lng: 105.76951 },
    },
  ]

  let locations = []

  for (let i = 0; i < locationsExample.length; i++) {
    const created_at = new Date()
    const updated_at = new Date()

    locations.push({
      name: locationsExample[i].name,
      created_by: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      position: locationsExample[i].latlng,
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
