require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./db/dbconnect');
const UserModel = require('./models/User');

const PORT = process.env.PORT || 8080;
const MongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

// Test to get all users in the database
app.get("/getuserstest", async (req, res) => {
  const userData = await UserModel.find();
  res.json(userData);
});

// Test to create a new user in the database
app.get("/createusertest", async (req, res) => {
  // Replace these fields to test database with new information (duplicate information will be rejected)
  const userJSON = {
    name: "bill",
    email: "bill.bill@bill.com",
    password: "billpassword"
  };

  try {
    const newUser = await UserModel.create(userJSON);
    res.json(newUser)
  } catch (error) {
    console.log(error);
    res.json("Could not create new user");
  }
});

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