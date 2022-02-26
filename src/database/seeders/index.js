import { connectDB } from '#database/mongodb.js'
import userSeeder from './User.js'
import vaccinationSeeder from './Vaccination.js'
import vaccine_typeSeeder from './Vaccine_type.js'
import locationSeeder from './Location.js'
import health_declarationSeeder from './Health_declaration.js'

// Init app
connectDB().then(seedDB)

async function seedDB() {
  await userSeeder(100)

  await vaccine_typeSeeder()

  await vaccinationSeeder(200)

  await locationSeeder(200)

  await health_declarationSeeder(200)

  console.log('Done')

  return
}
