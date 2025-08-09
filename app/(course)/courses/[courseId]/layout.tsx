import { getProgress } from "@/actions/get-progress";
import CourseNavbar from "@/app/(course)/courses/[courseId]/_components/course-navbar";
import CourseSidebar from "@/app/(course)/courses/[courseId]/_components/course-sidebar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const CourseLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ courseId: string }>;
}) => {
	const { courseId } = await params;
	const { userId } = await auth();
	if (!userId) {
		return redirect("/");
	}

	const course = await db.course.findUnique({
		where: {
			id: courseId,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				include: {
					userProgress: {
						where: {
							userId,
						},
					},
				},
				orderBy: {
					position: "asc",
				},
			},
		},
	});

	if (!course) {
		return redirect("/");
	}

	const progressCount = await getProgress(userId, course.id);
	return (
		<div className='h-full'>
			<div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
				<CourseNavbar course={course} progressCount={progressCount} />
			</div>
			<div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0'>
				<CourseSidebar course={course} progressCount={progressCount} />
			</div>
			<main className='md:pl-80 h-full pt-[80px]'>{children}</main>
		</div>
	);
};

export default CourseLayout;
