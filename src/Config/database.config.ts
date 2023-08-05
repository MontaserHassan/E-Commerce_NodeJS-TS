import mongoose from "mongoose";
import startingApp from './startIngApp.config';


const MONGO_URL: string = process.env.DATABASE_URL || '';

const connectDB = (app: any) => {
    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("Connected to MongoDB successfully")
            startingApp(app)
        })
        .catch(error => console.error("Error connecting to MongoDB:", error))
};

export default connectDB;