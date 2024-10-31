import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
		<div>
			<div>Sidebar</div>
			<div>Main</div>
			<Outlet />
		</div>
	);
};

export default MainLayout;
