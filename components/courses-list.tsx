import CourseCard from "@/components/card/course-card";
import { Category, Course } from "@/lib/generated/prisma";
import React from "react";

type CourseWithProgressWithCategory = Course & {
	category: Category | null;
	chapters: { id: string }[];
	progress: number | null;
};
interface CoursesListProps {
	items: CourseWithProgressWithCategory[];
}
const CoursesLists = ({ items }: CoursesListProps) => {
	return (
		<div>
			<div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
				{items.map((item) => (
					<CourseCard
						key={item.id}
						id={item.id}
						title={item.title}
						imageUrl={item.imageUrl!}
						chaptersLength={item.chapters.length}
						price={item.price!}
						progress={item.progress}
						category={item?.category?.name ?? ""}
					/>
				))}
			</div>
			{items.length === 0 && (
				<div className='text-center text-sm text-shadow-muted-foreground'>
					No courses has been found
				</div>
			)}
		</div>
	);
};

export default CoursesLists;
