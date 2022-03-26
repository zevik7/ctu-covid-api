import { connectDB } from '#database/mongodb.js'
import userSeeder from './User.js'
import injectionSeeder from './Injection.js'
import vaccine_typeSeeder from './Vaccine_type.js'
import locationSeeder from './Location.js'
import health_declarationSeeder from './Health_declaration.js'
import Positive_declarationSeeder from './Positive_declaration.js'

// Init app
connectDB().then(seedDB)

async function seedDB() {
  await userSeeder(1000)

  await vaccine_typeSeeder()

  await injectionSeeder(2000)

  await locationSeeder(2000)

  await health_declarationSeeder(2000)

  await Positive_declarationSeeder(1000)

  console.log('Done')

  return
}
