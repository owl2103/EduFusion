const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const path = require("path")

// Try to load .env.local file manually (for seed script)
const envPath = path.join(__dirname, "..", ".env.local")
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8")
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/?directConnection=true"
const dbName = process.env.MONGODB_DB_NAME || "edufusion"

const DEFAULT_ADMIN_EMAIL = "admin@institution.com"
const DEFAULT_ADMIN_PASSWORD = "admin123"
const DEFAULT_ADMIN_NAME = "Admin User"

async function seedAdmin() {
  let client
  
  try {
    console.log("🌱 Starting admin user seed...")
    
    // Connect to MongoDB
    client = new MongoClient(mongoUri)
    await client.connect()
    const db = client.db(dbName)
    const usersCollection = db.collection("users")
    
    // Check if admin user already exists
    const existingUser = await usersCollection.findOne({ email: DEFAULT_ADMIN_EMAIL })
    
    if (existingUser) {
      console.log("✅ Admin user already exists!")
      console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`)
      await client.close()
      return
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
    
    // Create the admin user
    const result = await usersCollection.insertOne({
      email: DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
      name: DEFAULT_ADMIN_NAME,
      createdAt: new Date(),
    })
    
    if (result.insertedId) {
      console.log("✅ Admin user created successfully!")
      console.log("\n📋 Login Credentials:")
      console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`)
      console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`)
      console.log("\n⚠️  Please change the password after first login!")
    }
    
    await client.close()
  } catch (error) {
    console.error("❌ Error seeding admin user:", error)
    if (client) {
      await client.close()
    }
    process.exit(1)
  }
}

seedAdmin()
  .then(() => {
    console.log("\n✨ Seed completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })

