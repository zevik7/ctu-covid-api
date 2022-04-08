import { connectDB } from '#database/mongodb.js'
import userSeeder from './User.js'
import injectionSeeder from './Injection.js'
import vaccine_typeSeeder from './Vaccine_type.js'
import locationSeeder from './Location.js'
import health_declarationSeeder from './Health_declaration.js'
import Positive_declarationSeeder from './Positive_declaration.js'
import ArticleSeeder from './Article.js'

// Init app
connectDB().then(seedDB)

async function seedDB() {
  await userSeeder(1000)

  await vaccine_typeSeeder()

  await locationSeeder()

  await injectionSeeder(3000)

  await health_declarationSeeder(400)

  await Positive_declarationSeeder(1000)

  await ArticleSeeder(5)

  console.log('Done')

  return
}
