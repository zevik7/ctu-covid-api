import { getDB } from '#database/mongodb.js'

const name = 'injections'

export default () => {
  const dbInstance = getDB()
  const Injection = dbInstance.collection(name)

  return Injection
}
