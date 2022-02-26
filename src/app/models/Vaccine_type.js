import { getDB } from '#database/mongodb.js'

const name = 'vaccine_types'

export default () => {
  const dbInstance = getDB()
  const VaccineType = dbInstance.collection(name)

  return VaccineType
}
