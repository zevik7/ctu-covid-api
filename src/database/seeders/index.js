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
  await userSeeder(100)

  await vaccine_typeSeeder()

  await injectionSeeder(200)

  await locationSeeder(200)

  await health_declarationSeeder(200)

  await Positive_declarationSeeder(100)

  console.log('Done')

  return
}
