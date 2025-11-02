// seedUsers.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/userModel.js"; // ✅ Make sure you already have this model

dotenv.config();

const users = [
  {
    name: "Daphne Mary",
    email: "daphne@billwise.com",
    password: bcrypt.hashSync("Daphne@123", 10),
    role: "admin",
  },
  {
    name: "Ayesha Khan",
    email: "ayesha@billwise.com",
    password: bcrypt.hashSync("Ayesha@123", 10),
    role: "user",
  },
  {
    name: "Mary Thomas",
    email: "mary@billwise.com",
    password: bcrypt.hashSync("Mary@123", 10),
    role: "user",
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await User.deleteMany();
    await User.insertMany(users);

    console.log("🎉 Sample users inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
    process.exit(1);
  }
};

seedUsers();
