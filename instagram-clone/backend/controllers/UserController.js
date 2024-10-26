import User from "../models/UserModel.js";
import { Post } from "../models/PostModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/Datauri.js";
import cloudinary from "../utils/Cloudnary.js";
export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(401).json({
				success: false,
				message: "Something is missing, please check!.",
			});
		}
		const user = await User.findOne({ email });
		if (user) {
			return res.status(401).json({
				success: false,
				message: "Try different email.",
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			username,
			email,
			password: hashedPassword,
		});
		return res.status(201).json({
			success: true,
			message: "Account created successfully.",
		});
	} catch (error) {
		console.log(`Register Error : ${error}`);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(401).json({
				success: false,
				message: "Something is missing, please check!.",
			});
		}
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "email or password are invalid.",
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(200).json({
				success: false,
				message: "email or password are invalid.",
			});
		}
		delete user.password;
		const token = await jwt.sign(
			{ userId: user._id },
			process.env.SECRET_KEY,
			{ expiresIn: "1d" }
		);
		//populate each post if in the psot array.
		const populatedPosts = await Promise.all(
			user.posts.map(async (postId) => {
				const post = await Post.findById(postId);
				if (post.author.equals(user._id)) {
					return post;
				}
				return null;
			})
		);
		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			followers: user.followers,
			following: user.following,
			posts: populatedPosts,
		};
		return res
			.cookie("token", token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1 * 24 * 60 * 60 * 1000,
			})
			.json({
				success: true,
				message: `Welcome Back ${user.username}`,
				user,
				token,
			});
	} catch (error) {
		console.log(`Login Error : ${error}`);
	}
};

export const logout = async (_, res) => {
	try {
		return res.cookie("token", "", { maxAge: 0 }).json({
			success: true,
			message: `Logout successfully`,
		});
	} catch (error) {
		console.log(`Logout Error : ${error}`);
	}
};

export const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found.",
			});
		}
		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		console.log(`GetProfile Error : ${error}`);
	}
};
export const editProfile = async (req, res) => {
	try {
		const userId = req.id; //Getting this by userAuthenication middleware
		const { bio, gender } = req.body;
		const profilePicture = req.file;
		let cloudResponse;
		if (profilePicture) {
			const fileUri = getDataUri(profilePicture);
			cloudResponse = await cloudinary.uploader.upload(fileUri);
		}
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "User not found.",
			});
		}
		if (bio) user.bio = bio;
		if (gender) user.gender = gender;
		if (profilePicture) user.profilePicture = cloudResponse.secure_url;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Profile updated.",
			user,
		});
	} catch (error) {
		console.log(`Edit Profile Error : ${error}`);
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.id; //Getting this by userAuthenication middleware
		const suggestedUsers = await User.find({ _id: { $ne: userId } }).select(
			"-password"
		);
		if (!suggestedUsers) {
			return res.status(400).json({
				success: false,
				message: "Currently dont have any users.",
			});
		}
		return res.status(200).json({
			success: true,
			suggestedUsers,
		});
	} catch (error) {
		console.log(`Suggested users Error : ${error}`);
	}
};
export const followOrUnfollow = async (req, res) => {
	try {
		const followKarneWala = req.id; //Getting this by userAuthenication middleware
		const jiskoFollowKarunga = req.params.id;
		if (followKarneWala === jiskoFollowKarunga) {
			return res.status(200).json({
				success: false,
				message: "You can't follow/unfollow yourself.",
			});
		}
		const user = await User.findById(followKarneWala);
		const targetUser = await User.findById(jiskoFollowKarunga);
		if (!user || !targetUser) {
			return res.status(400).json({
				success: false,
				message: "User not found.",
			});
		}
		// mai check karunga follow karana hai ya nehi
		const idFollowing = user.following.includes(jiskoFollowKarunga);
		if (idFollowing) {
			//unfollow logic
			await Promise.all([
				User.updateOne(
					{ _id: followKarneWala },
					{ $pull: { following: jiskoFollowKarunga } }
				),
				User.updateOne(
					{ _id: jiskoFollowKarunga },
					{ $pull: { followers: followKarneWala } }
				),
			]);

			return res.status(200).json({
				success: true,
				message: "Unfollowed successfully.",
			});
		} else {
			//follow logic
			await Promise.all([
				User.updateOne(
					{ _id: followKarneWala },
					{ $push: { following: jiskoFollowKarunga } }
				),
				User.updateOne(
					{ _id: jiskoFollowKarunga },
					{ $push: { followers: followKarneWala } }
				),
			]);
			return res.status(200).json({
				success: true,
				message: "Followed successfully.",
			});
		}
	} catch (error) {
		console.log(`Follow or Unfollow Error : ${error}`);
	}
};
