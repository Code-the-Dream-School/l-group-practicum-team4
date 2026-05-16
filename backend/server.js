require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./db/dbconnect");
const UserModel = require("./src/models/User");

const PORT = process.env.PORT || 8080;
const MongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

// Start App
const start = async () => {
  try {
    await connectDB(MongoURI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Sever failed to start");
    console.log(error);
  }
};

start();
