import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Mongo DB connected successfully");
	} catch (error) {
		console.log(`Mongo DB Connection Error : ${error}`);
	}
};
export default connectDB;