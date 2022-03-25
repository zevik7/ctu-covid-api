import { getDB } from '#database/mongodb.js'

const name = 'positive_declarations'

export default () => {
  const dbInstance = getDB()
  const PositiveDeclaration = dbInstance.collection(name)

  return PositiveDeclaration
}
