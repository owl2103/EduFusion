import { MongoClient, type Db, type Collection } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/?directConnection=true"
const dbName = process.env.MONGODB_DB_NAME || "edufusion"

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!mongoUri) {
    throw new Error("Please add your MONGODB_URI to .env.local")
  }

  const client = new MongoClient(mongoUri)
  await client.connect()
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getUsersCollection(): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection("users")
}
