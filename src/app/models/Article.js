import { getDB } from '#database/mongodb.js'

const name = 'articles'

export default () => {
  const dbInstance = getDB()
  const Article = dbInstance.collection(name)

  return Article
}
