import faker from '@faker-js/faker'
import dateFormat from 'dateformat'
import getArticle from '#models/Article.js'
import getUserModel from '#models/User.js'
import getLocationModel from '#models/Location.js'

export default async (qty) => {
  // Remove all previous data
  await getArticle()
    .deleteMany({})
    .then((rs) => {
      console.log('Remove all previous articles successful')
    })

  const users = await getUserModel().find({ role: 'admin' }).toArray()

  const articles = []

  for (let i = 0; i < qty; i++) {
    const user = faker.random.arrayElement(users)
    const created_at = faker.date.between('2022-01-01', dateFormat(new Date()))
    const title = 'Hướng dẫn số ' + (i + 1)
    const content = 'Nội dung hướng dẫn số' + (i + 1)

    articles.push({
      created_by: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      title,
      content,
      pinned: Math.random() < 0.1 ? true : false,
      created_at,
      updated_at: created_at,
    })
  }

  await getArticle()
    .insertMany(articles)
    .then((rs) => {
      console.log('Article - seeding successful')
    })
}
