import { Conversation } from "../models/ConversationModel.js";
import { Message } from "../models/MessageModel.js";
//For Chatting
export const sendMessage = async (req, res) => {
	try {
		const senderId = req.id;
		const receiverId = req.params.id;
		const { message } = req.body;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});
		//established the conversation if not start yet
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}
		const newMessage = await Message.create({
			senderId,
			receiverId,
			message,
		});
		if (newMessage) conversation.messages.push(newMessage._id);
		// await conversation.save();
		// await newMessage.save();
		await Promise.all([conversation.save(), newMessage.save()]);
		//TODO : Impliment socket io for real time data transfor

		return res.status(201).json({
			success: true,
			message: "Message Created successfully",
			newMessage,
		});
	} catch (error) {
		console.log(`Send Message Error : ${error}`);
	}
};
