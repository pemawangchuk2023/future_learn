import CourseSidebarItem from "@/app/(course)/courses/[courseId]/_components/course-sidebar-item";
import CourseProgress from "@/components/course-progress";
import { db } from "@/lib/db";
import { Chapter, Course, UserProgress } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface CourseSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
	const { userId } = await auth();
	if (!userId) {
		return redirect("/");
	}

	const purchases = await db.purchase.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId: course.id,
			},
		},
	});

	return (
		<div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
			<div className='p-8 flex flex-col border-b'>
				<h1 className='font-bold'>{course.title}</h1>
				{purchases && (
					<div className='mt-10'>
						<CourseProgress variant='success' value={progressCount} />
					</div>
				)}
			</div>
			<div className='flex flex-col w-full'>
				{course.chapters.map((chapter) => (
					<CourseSidebarItem
						key={chapter.id}
						id={chapter.id}
						label={chapter.title}
						isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
						courseId={course.id}
						isLocked={!chapter.isFree && !purchases}
					/>
				))}
			</div>
		</div>
	);
};

export default CourseSidebar;
