"use client";

import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import { guestRoutes, teacherRoutes } from "@/constants";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarRoutes = () => {
	const pathname = usePathname();

	const isTeacherPage = pathname?.includes("/teacher");

	const routes = isTeacherPage ? teacherRoutes : guestRoutes;
	return (
		<div className='flex flex-col w-full text-foreground'>
			{routes.map((route) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	);
};

export default SidebarRoutes;
