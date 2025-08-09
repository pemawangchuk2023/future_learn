import CourseMobileSidebar from "@/app/(course)/courses/[courseId]/_components/course-mobile-sidebar";
import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@/lib/generated/prisma";
import React from "react";

interface CourseNavbarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
}

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
	return (
		<div className='p-4 border-b h-full flex items-center'>
			<CourseMobileSidebar course={course} progressCount={progressCount} />
			<NavbarRoutes />
		</div>
	);
};

export default CourseNavbar;
