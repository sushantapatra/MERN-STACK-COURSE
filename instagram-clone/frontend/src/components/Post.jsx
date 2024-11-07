import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = () => {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const changeHandleEvent = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setText(inputText);
		} else {
			setText("");
		}
	};
	return (
		<div className="my-8 w-full max-w-sm mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src="" alt="post-image" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<h1>username</h1>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<MoreHorizontal className="cursor-pointer" />
					</DialogTrigger>
					<DialogContent className="flex flex-col items-center text-sm text-center">
						<Button
							variant="ghost"
							className="cursor-pointer w-fit text-[#ED4956]"
						>
							Unfollow
						</Button>

						<Button
							variant="ghost"
							className="cursor-pointer w-fit"
						>
							Add to favorites
						</Button>

						<Button
							variant="ghost"
							className="cursor-pointer w-fit"
						>
							Delete
						</Button>
					</DialogContent>
				</Dialog>
			</div>
			<img
				src="https://images.unsplash.com/photo-1709884735626-63e92727d8b6?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="post-image"
				className="rounded-md my-2 w-full aspect-square object-cover"
			/>
			<div className="flex items-center justify-between my-2">
				<div className="flex items-center gap-3">
					<FaRegHeart
						size={"22px"}
						className="cursor-pointer hover:text-gray-600"
					/>
					<MessageCircle
						className="cursor-pointer hover:text-gray-600"
						onClick={() => setOpen(true)}
					/>
					<Send className="cursor-pointer hover:text-gray-600" />
				</div>
				<Bookmark className="cursor-pointer hover:text-gray-600" />
			</div>
			<span className="font-medium block mb-2 text-left">1k likes</span>
			<p className="font-medium mr-2 text-left">
				<span>Username</span>
				Caption
			</p>
			<span
				className="font-small mr-2 block text-left cursor-pointer text-gray-400"
				onClick={() => setOpen(true)}
			>
				View all 10 comments
			</span>
			<CommentDialog open={open} setOpen={setOpen} />
			<div className="flex items-center justify-between">
				<input
					type="text"
					placeholder="Add a comment..."
					className="outline-none text-sm w-full"
					value={text}
					onChange={changeHandleEvent}
				/>
				{text && <span className="text-[#3BADF8]">Post</span>}
			</div>
		</div>
	);
};

export default Post;
