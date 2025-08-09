"use server";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@/lib/generated/prisma";

type CourseWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

type DashboardCourses = {
	completedCourses: CourseWithProgressWithCategory[];
	courseInProgress: CourseWithProgressWithCategory[];
};

export async function getDashboardCourses(
	userId: string
): Promise<DashboardCourses> {
	try {
		const purchasedCourses = await db.purchase.findMany({
			where: { userId },
			select: {
				course: {
					include: {
						category: true,
						chapters: { where: { isPublished: true } },
					},
				},
			},
		});

		const courses = purchasedCourses.map(
			(purchase) => purchase.course
		) as CourseWithProgressWithCategory[];

		for (const course of courses) {
			const progress = await getProgress(userId, course.id);
			course["progress"] = progress;
		}

		const completedCourses = courses.filter(
			(course) => course.progress === 100
		);
		const courseInProgress = courses.filter(
			(course) => (course.progress ?? 0) < 100
		);

		return {
			completedCourses,
			courseInProgress,
		};
	} catch (error) {
		console.log(error);
		return {
			completedCourses: [],
			courseInProgress: [],
		};
	}
}
