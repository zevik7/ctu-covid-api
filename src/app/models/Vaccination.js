import { getDB } from '#database/mongodb.js'

const name = 'vaccinations'

export default () => {
  const dbInstance = getDB()
  const Vaccination = dbInstance.collection(name)

  return Vaccination
}
