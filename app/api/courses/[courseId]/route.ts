import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { isTeacher } from "@/lib/teacher";

const mux = new Mux({
	tokenId: process.env.MUX_TOKEN_ID!,
	tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ courseId: string }> }
) {
	try {
		const { userId } = await auth();

		if (!userId || !isTeacher(userId)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { courseId } = await params;

		const data = await req.json();

		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
			data,
		});

		return NextResponse.json(course);
	} catch (error) {
		console.error("[COURSE_ID_PATCH]", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ courseId: string }> }
) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { courseId } = await params;

		const course = await db.course.findUnique({
			where: {
				id: courseId,
				userId: userId,
			},
			include: {
				chapters: {
					include: {
						muxData: true,
					},
				},
			},
		});
		if (!course) {
			return new NextResponse("Not found", { status: 404 });
		}

		for (const chapter of course.chapters) {
			if (chapter.muxData?.assetId) {
				await mux.video.assets.delete(chapter.muxData.assetId);
			}
		}

		const deletedCourse = await db.course.delete({
			where: {
				id: courseId,
			},
		});
		return NextResponse.json(deletedCourse);
	} catch (error) {
		console.log(error);
	}
}
