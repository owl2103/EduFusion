import { getUsersCollection } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

const DEFAULT_ADMIN_EMAIL = "admin@institution.com"
const DEFAULT_ADMIN_PASSWORD = "admin123"
const DEFAULT_ADMIN_NAME = "Admin User"

async function seedAdmin() {
  try {
    console.log("🌱 Starting admin user seed...")
    
    const usersCollection = await getUsersCollection()
    
    // Check if admin user already exists
    const existingUser = await usersCollection.findOne({ email: DEFAULT_ADMIN_EMAIL })
    
    if (existingUser) {
      console.log("✅ Admin user already exists!")
      console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`)
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
  } catch (error) {
    console.error("❌ Error seeding admin user:", error)
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

