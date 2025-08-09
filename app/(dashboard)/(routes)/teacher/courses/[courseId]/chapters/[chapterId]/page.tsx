import ChapterAccessForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-acess-form";
import ChapterActions from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-actions";
import ChapterDescriptionForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import ChapterTitleForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import ChapterVideoForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-video-form";
import Banner from "@/components/banner";
import IconBadge from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, SettingsIcon, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const ChapterIdPage = async ({
	params,
}: {
	params: Promise<{ courseId: string; chapterId: string }>;
}) => {
	const { userId } = await auth();
	const { courseId, chapterId } = await params;

	if (!userId) {
		return redirect("/");
	}

	const chapter = await db.chapter.findUnique({
		where: {
			id: chapterId,
			courseId: courseId,
		},
		include: {
			muxData: true,
		},
	});

	if (!chapter) {
		redirect("/");
	}

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `${completedFields} of ${totalFields} fields completed`;

	const isComplete = requiredFields.every(Boolean);

	return (
		<>
			{!chapter.isPublished && (
				<Banner
					variant='warning'
					label='This chapter is not published and it will not be visible in the course.'
				/>
			)}
			<div className='min-h-screen p-6'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex items-center justify-between mb-8'>
						<div className='w-full'>
							<Link
								href={`/teacher/courses/${courseId}`}
								className='inline-flex items-center text-sm text-foreground-600 px-3 py-2  mb-6 group'
							>
								<ArrowLeft className='h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200' />
								Back to Course
							</Link>
							<div className='flex items-center justify-between w-full'>
								<div className='flex flex-col gap-y-2'>
									<h1 className='text-xl font-bold text-yellow-500'>
										Chapter Creation
									</h1>
									<div className='flex items-center gap-2'>
										<div className='h-2 w-2 rounded-full bg-blue-500'></div>
										<span className='text-sm text-foreground font-medium'>
											Complete all fields {completionText}
										</span>
									</div>
								</div>
								<ChapterActions
									disabled={!isComplete}
									courseId={courseId}
									chapterId={chapterId}
									isPublished={chapter.isPublished}
								/>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						<div className='space-y-6'>
							<div className='rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300'>
								<div className='px-6 py-4 '>
									<div className='flex items-center gap-x-3'>
										<div className='p-2 '>
											<LayoutDashboard className='h-5 w-5 text-blue-600' />
										</div>
										<h2 className='text-lg font-semibold text-foreground'>
											Customise your chapter
										</h2>
									</div>
								</div>
								<div className='p-6 space-y-6'>
									<ChapterTitleForm
										initialData={chapter}
										courseId={courseId}
										chapterId={chapterId}
									/>
									<ChapterDescriptionForm
										initialData={chapter}
										courseId={courseId}
										chapterId={chapterId}
									/>
								</div>
							</div>
						</div>
						<div className='space-y-2'>
							<div className='p-2'>
								<ChapterAccessForm
									initialData={chapter}
									courseId={courseId}
									chapterId={chapterId}
								/>
							</div>
							{/* Video Part */}
							<div className='flex items-center gap-x-2'>
								<IconBadge icon={Video} />
								<h2 className='text-xl'>Add a Video</h2>
							</div>
							<ChapterVideoForm
								initialData={chapter}
								chapterId={chapterId}
								courseId={courseId}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChapterIdPage;
