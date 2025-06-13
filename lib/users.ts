import { ObjectId } from "mongodb"
import { hash } from "bcrypt"
import clientPromise from "@/lib/mongodb"

export type User = {
  _id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

export async function getUserById(id: string): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  try {
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) return null

    return {
      ...user,
      _id: user._id.toString(),
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function updateUser(id: string, data: Partial<Omit<User, "_id" | "createdAt">>): Promise<User | null> {
  const client = await clientPromise
  const db = client.db()

  try {
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: data })

    return getUserById(id)
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  try {
    const hashedPassword = await hash(newPassword, 10)

    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { password: hashedPassword } })

    return true
  } catch (error) {
    console.error("Error updating password:", error)
    return false
  }
}
