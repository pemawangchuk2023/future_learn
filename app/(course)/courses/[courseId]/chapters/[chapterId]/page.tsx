import { getChapter } from "@/actions/get-chapter";
import CourseEnrollButton from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button";
import CourseProgressButton from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-progress-button";
import VideoPlayer from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player";
import Banner from "@/components/banner";
import Preview from "@/components/editor/Preview";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const ChapterId = async ({
	params,
}: {
	params: Promise<{ courseId: string; chapterId: string }>;
}) => {
	const { courseId, chapterId } = await params;
	const { userId } = await auth();
	if (!userId) {
		return redirect("/");
	}

	const {
		chapter,
		course,
		muxData,
		attachments,
		nextChapter,
		userProgress,
		purchase,
	} = await getChapter({
		userId,
		chapterId: chapterId,
		courseId: courseId,
	});

	if (!chapter || !course) {
		return redirect("/");
	}

	const isLocked = !chapter.isFree && !purchase;
	const completeOnEnd = !!purchase && !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner
					variant='success'
					label='You have already completed the course'
				/>
			)}
			{isLocked && (
				<Banner
					variant='warning'
					label='You need to purchase this course to watch this chapter.'
				/>
			)}
			<div className='flex flex-col max-w-4xl mx-auto pb-20'>
				<div className='p-4'>
					<VideoPlayer
						chapterId={chapterId}
						title={chapter.title}
						courseId={courseId}
						nextChapterId={nextChapter?.id}
						playbackId={muxData?.playbackId ?? ""}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>
				<div>
					<div className='p-4 flex flex-col md:flex-row items-center justify-between'>
						<h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
						{purchase ? (
							<CourseProgressButton
								chapterId={chapterId}
								courseId={courseId}
								nextChapterId={nextChapter?.id}
								isCompleted={!!userProgress?.isCompleted}
							/>
						) : (
							<div>
								<CourseEnrollButton courseId={courseId} price={course.price!} />
							</div>
						)}
					</div>
					<Separator />
					<div>
						<Preview content={chapter.description!} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className='p-4'>
								{attachments.map((attachment) => (
									<Link
										href={attachment.url}
										target='_blank'
										key={attachment.id}
									>
										<p>{attachment.name}</p>
									</Link>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterId;
