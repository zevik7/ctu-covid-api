import { connectDB, getDB } from '#database/mongodb.js'

// Init app
connectDB().then(migration)

async function migration() {
  getDB().createCollection('vaccinations')
}
