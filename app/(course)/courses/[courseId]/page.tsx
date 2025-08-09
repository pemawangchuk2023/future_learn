import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type PageProps = {
	params: Promise<{ courseId: string }>;
};

export default async function CourseIdPage({ params }: PageProps) {
	const { courseId } = await params;

	const course = await db.course.findUnique({
		where: { id: courseId },
		include: {
			chapters: {
				where: { isPublished: true },
				orderBy: { position: "asc" },
			},
		},
	});

	if (!course || course.chapters.length === 0) {
		return redirect("/");
	}

	return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
