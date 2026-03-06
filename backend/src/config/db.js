const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(mongoUri);
        // eslint-disable-next-line no-console
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
