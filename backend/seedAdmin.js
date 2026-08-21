const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // or bcrypt if you're using it
const Admin = require("./src/models/Admin"); // check path carefully

console.log("Starting seed script...");

mongoose.connect("mongodb://fizzaAli321:fizzaAli321@ac-1rgmrg7-shard-00-00.nzk8wvi.mongodb.net:27017,ac-1rgmrg7-shard-00-01.nzk8wvi.mongodb.net:27017,ac-1rgmrg7-shard-00-02.nzk8wvi.mongodb.net:27017/?ssl=true&replicaSet=atlas-nd307g-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

const createAdmin = async () => {
  try {
    console.log("Creating admin...");

    const hashedPassword = await bcrypt.hash("05102006", 10);

    const admin = await Admin.create({
      email: "liaqatfiza9@gmail.com",
      password: hashedPassword
    });

    console.log("Admin created:", admin);

    process.exit();
  } catch (error) {
    console.log("Error:", error);
  }
};

createAdmin();