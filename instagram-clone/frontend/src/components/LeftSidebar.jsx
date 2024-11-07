import {
	Heart,
	Home,
	LogOut,
	MessageCircle,
	PlusSquare,
	Search,
	TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const sidebarItems = [
	{ icon: <Home />, text: "Home" },
	{ icon: <Search />, text: "Search" },
	{ icon: <TrendingUp />, text: "Explore" },
	{ icon: <MessageCircle />, text: "Messages" },
	{ icon: <Heart />, text: "Notifications" },
	{ icon: <PlusSquare />, text: "Create" },
	{
		icon: (
			<Avatar className="w-6 h-6">
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		),
		text: "Profile",
	},
	{ icon: <LogOut />, text: "Logout" },
];
const LeftSidebar = () => {
	const navigate = useNavigate();
	const logoutHandler = async () => {
		try {
			const res = await axios.get(
				"http://localhost:8000/api/v1/user/logout"
			);
			if (res.data.success) {
				toast.success(res.data.message);
				navigate("/login");
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const sidebarHandler = (menu) => {
		if (menu == "Logout") logoutHandler();
	};
	return (
		<div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
			<div className="flex flex-col">
				<h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
				<div>
					{sidebarItems.map((item, index) => {
						return (
							<div
								key={index}
								className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-1"
								onClick={() => sidebarHandler(item.text)}
							>
								{item.icon}
								<span>{item.text}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default LeftSidebar;
