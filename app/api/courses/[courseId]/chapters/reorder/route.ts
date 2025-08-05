import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ courseId: string }> }
) {
	try {
		// 1. ASYNC PARAMS
		const { courseId } = await params;

		// 2. AUTH
		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("UnAuthorized", { status: 401 });
		}

		// 3. JSON BODY
		const { chapters } = await req.json();
		if (!Array.isArray(chapters)) {
			return new NextResponse("Bad Request: list must be an array", {
				status: 400,
			});
		}

		// 4. COURSE OWNERSHIP CHECK
		const ownCourse = await db.course.findUnique({
			where: {
				id: courseId,
				userId,
			},
		});
		if (!ownCourse) {
			return new NextResponse("UnAuthorized", { status: 401 });
		}

		// 5. REORDER CHAPTERS
		for (const item of chapters) {
			await db.chapter.update({
				where: { id: item.id },
				data: { position: item.position },
			});
		}
		return new NextResponse("success", { status: 200 });
	} catch (error) {
		console.log(error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
