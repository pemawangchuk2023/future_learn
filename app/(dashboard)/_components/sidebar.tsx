import Logo from "@/app/(dashboard)/_components/logo";
import SidebarRoutes from "@/app/(dashboard)/_components/sidebar-routes";
import ThemeToggle from "@/components/themes/theme-toggle";
import React from "react";

const Sidebar = () => {
	return (
		<div className='h-full border-r flex flex-col overflow-y-auto'>
			<ThemeToggle />
			<div className='p-6'>
				<Logo />
			</div>
			<div className='flex flex-col w-full'>
				<SidebarRoutes />
			</div>
		</div>
	);
};

export default Sidebar;
