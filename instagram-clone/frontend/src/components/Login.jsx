import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
	const [input, setInput] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const changeEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};
	const signupHandler = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await axios.post(
				"http://localhost:8000/api/v1/user/login",
				input
			);

			if (res.data.success) {
				setInput({
					email: "",
					password: "",
				});
				navigate("/");
				toast.success(res.data.message);
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.success(error.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex items-center justify-center h-screen">
			<form
				className="shadow-lg flex flex-col gap-2 p-8 "
				onSubmit={signupHandler}
			>
				<div className="my-4">
					<h1 className="text-center font-bold text-xl">LOGO</h1>
					<p className="text-center text-sm">
						Login to see photos & videos from your friends
					</p>
				</div>

				<div className="">
					<Label htmlFor="email" className="font-medium text-left">
						Email
					</Label>
					<Input
						type="email"
						name="email"
						id="email"
						className="focus-visible:ring-transparent my-2"
						autoComplete="off"
						value={input.email}
						onChange={changeEventHandler}
					/>
				</div>
				<div className="">
					<Label htmlFor="password" className="font-medium text-left">
						Password
					</Label>
					<Input
						type="password"
						name="password"
						id="password"
						className="focus-visible:ring-transparent my-2"
						autoComplete="off"
						value={input.password}
						onChange={changeEventHandler}
					/>
				</div>

				{loading ? (
					<Button>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Please wait...
					</Button>
				) : (
					<Button type="submit" className="">
						Login
					</Button>
				)}
				<span className="text-center">
					Doesnot have an account?
					<Link className="text-blue-500" to="/signup">
						Signup
					</Link>
				</span>
			</form>
		</div>
	);
};

export default Login;
