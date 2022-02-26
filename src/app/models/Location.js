import { getDB } from '#database/mongodb.js'

const name = 'locations'

export default () => {
  const dbInstance = getDB()
  const Location = dbInstance.collection(name)

  return Location
}
