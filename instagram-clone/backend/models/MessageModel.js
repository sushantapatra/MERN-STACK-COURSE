import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	receiverId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	message: {
		type: String,
		required: [true, "Message is required"],
	},
});

export default Message = mongoose.model("Message", messageSchema);
