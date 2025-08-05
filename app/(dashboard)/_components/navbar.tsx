import MobileSidebar from "@/app/(dashboard)/_components/mobile-sidebar";
import NavbarRoutes from "@/components/navbar-routes";
import React from "react";

const Navbar = () => {
	return (
		<div className='p-4 border-b h-full flex items-center'>
			<MobileSidebar />
			<NavbarRoutes />
		</div>
	);
};

export default Navbar;
