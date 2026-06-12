import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./db/dbconnect.js";
import UserModel from "./src/models/User.js";

import { seedItems } from "./src/seeds/item.js";
import { seedEnemies } from "./src/seeds/enemy.js";

const PORT = process.env.PORT || 8080;
const MongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

// Start App
const start = async () => {
	try {
		await connectDB(MongoURI);

		//seeding starting data
		await seedItems();
		await seedEnemies();

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log("Sever failed to start");
		console.log(error);
	}
};

start();
