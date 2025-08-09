import Actions from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/actions";
import AttachmentForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/attachment-form";
import CategoryForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/category-form";
import ChaptersForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapters-form";
import DescriptionForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/description-form";
import ImageForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form";
import PriceForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/price-form";
import TitleForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form";
import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = await auth();

	const { courseId } = await params;

	if (!userId) {
		redirect("/");
	}

	const course = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
		include: {
			chapters: {
				orderBy: {
					position: "asc",
				},
			},
			attachment: {
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});
	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	if (!course) {
		return redirect("/");
	}

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
		course.attachment.length > 0,
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `${completedFields}/${totalFields}`;
	const completionPercentage = Math.round(
		(completedFields / totalFields) * 100
	);

	const isComplete = requiredFields.every(Boolean);

	return (
		<>
			{!course.isPublished && (
				<Banner label='This course is not published. It will not be available to the students' />
			)}
			<div className='w-full'>
				<div className='container mx-auto px-4 py-8 max-w-7xl'>
					{/* Header Section */}
					<div className='mb-8'>
						<div className='flex flex-col gap-4'>
							<div className='space-y-2 items-center justify-center'>
								<Link href='/teacher/courses'>
									<Button
										className='mb-4 text-purple-500 rounded-none px-6 cursor-pointer'
										variant='outline'
									>
										Go Back to the Course Table
									</Button>
								</Link>
								<p className='text-foreground text-xl capitalize'>
									Complete all fields to publish your course
								</p>
							</div>

							{/* Progress Card */}
							<div className='border p-6 min-w-[280px]'>
								<div className='flex items-center gap-3 mb-3'>
									<div className='p-2 bg-blue-100 rounded-lg'>
										<Clock className='h-5 w-5 text-blue-600' />
									</div>
									<div>
										<p className='text-sm font-medium text-foreground'>
											Progress
										</p>
										<p className='text-xs text-foreground'>
											Complete all fields
										</p>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex justify-between items-center'>
										<span className='text-sm text-foreground'>Completed</span>
										<span className='text-sm font-semibold text-foreground'>
											{completionText}
										</span>
									</div>
									<div className='w-full bg-slate-200 rounded-full h-2 mb-2'>
										<div
											className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
											style={{ width: `${completionPercentage}%` }}
										/>
									</div>
									<p className='text-xs text-foreground'>
										{completionPercentage}% complete
									</p>
								</div>
								<Actions
									disabled={!isComplete}
									courseId={courseId}
									isPublished={course.isPublished}
								/>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className='space-y-8'>
						{/* Section Header */}
						<div className='flex items-center justify-center gap-4 pb-4 border-b'>
							<div className='p-3'>
								<LayoutDashboard className='h-6 w-6' />
							</div>
							<div>
								<h2 className='text-2xl font-extrabold text-yellow-500'>
									Customize Your Course
								</h2>
								<p className='text-green-500 capitalize font-extrabold'>
									Add the essential details for your course
								</p>
							</div>
						</div>
						{/* Forms Grid */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							<TitleForm initialData={course} courseId={course.id} />
							<DescriptionForm initialData={course} courseId={course.id} />
							<ImageForm initialData={course} courseId={course.id} />
							<CategoryForm
								initialData={course}
								courseId={course.id}
								options={categories.map((category) => ({
									label: category.name,
									value: category.id,
								}))}
							/>
						</div>
						<div className='space-y-6'>
							<ChaptersForm initialData={course} courseId={course.id} />
						</div>
						<div>
							<PriceForm initialData={course} courseId={course.id} />
						</div>
						<div>
							<div className='flex items-center gap-x-2'>
								<h2 className='text-yellow-500 font-extrabold text-xl'>
									7. Resources & Attachments
								</h2>
							</div>
							<AttachmentForm
								initialData={{ ...course, attachments: course.attachment }}
								courseId={course.id}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CourseIdPage;
