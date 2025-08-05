"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SidebarItemProps {
	icon: LucideIcon;
	label: string;
	href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
	const pathname = usePathname();
	const router = useRouter();

	const isActive =
		(pathname === "/" && href === "/") ||
		pathname === href ||
		pathname?.startsWith(`${href}/`);

	const onClick = () => {
		router.push(href);
	};

	return (
		<button
			onClick={onClick}
			type='button'
			className={cn(
				"flex items-center w-full gap-x-2 text-foreground text-sm font-medium pl-6 py-2 rounded-lg transition-all hover:bg-muted/60 focus:bg-muted/80 outline-none focus-visible:ring-2 ring-primary",
				isActive
					? "bg-primary/10 text-primary dark:bg-primary/20"
					: "hover:text-primary"
			)}
		>
			<Icon
				size={22}
				className={cn(
					"text-foreground transition-colors",
					isActive ? "text-primary" : "group-hover:text-primary"
				)}
			/>
			<span>{label}</span>
			{/* Left border for active indicator */}
			{isActive && (
				<div className='ml-auto w-1 h-8 bg-primary rounded-l-full transition-all' />
			)}
		</button>
	);
};

export default SidebarItem;
