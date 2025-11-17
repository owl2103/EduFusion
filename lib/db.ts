import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error("Please add your Mongo URI to .env.local")
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(mongoUri)
  await client.connect()
  const db = client.db("edufusion")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}
