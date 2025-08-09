"use client";
import SearchInput from "@/app/(dashboard)/(routes)/search/_components/search-input";
import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";
import { useAuth, UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarRoutes = () => {
	const pathname = usePathname();
	const { userId } = useAuth();

	const isTeacherPage = pathname?.startsWith("/teacher");
	const isCoursePage = pathname?.includes("/courses");
	const isSearchPage = pathname === "/search";

	return (
		<>
			{isSearchPage && (
				<div className='hidden md:block'>
					<SearchInput />
				</div>
			)}
			<div className='flex gap-x-2 ml-auto'>
				{isTeacherPage || isCoursePage ? (
					<Link href='/'>
						<Button size='sm' variant='ghost' className='cursor-pointer'>
							<LogOut className='h-4 w-4 mr-2' />
							Exit
						</Button>
					</Link>
				) : isTeacher(userId) ? (
					<Link href='/teacher/courses'>
						<Button size='sm' variant='ghost'>
							Teacher Mode
						</Button>
					</Link>
				) : null}
				<UserButton />
			</div>
		</>
	);
};

export default NavbarRoutes;
