const mongoose = require("mongoose");
require("dotenv").config;

const options = {
    serverSelectionTimeoutMS: 5000,
};

const connectDB = async (url) => {
    try {
        console.log("Connecting DB...")
        if (mongoose.connection.readyState != 1) {
            await mongoose.connect(url, options);
            console.log("DB connected");
        } else {
            console.log("DB already connected");
        }
    } catch(error) {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    }
}

module.exports = { connectDB };