import CourseProgress from "@/components/course-progress";
import IconBadge from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CourseCardProps {
	key: string;
	id: string;
	title: string;
	imageUrl: string;
	chaptersLength: number;
	price: number;
	progress: number | null;
	category?: string | null;
}

const CourseCard = ({
	id,
	title,
	imageUrl,
	chaptersLength,
	price,
	progress,
	category,
}: CourseCardProps) => {
	return (
		<Link href={`/courses/${id}`}>
			<div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
				<div className='relative w-full aspect-video rounded-md overflow-hidden'>
					<Image src={imageUrl} fill className='object-cover' alt='title' />
				</div>
				<div className='flex flex-col pt-2'>
					<div className='text-lg md:text-base font-medium text-foreground'>
						{title}
					</div>
					<p className='text-xl text-foreground'>{category}</p>
					<div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
						<div className='flex items-center gap-x-1 text-foreground'>
							<IconBadge size='sm' icon={BookOpen} />
							<span>
								{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
							</span>
						</div>
					</div>
					{progress !== null ? (
						<CourseProgress
							size='sm'
							value={progress}
							variant={progress === 100 ? "success" : "default"}
						/>
					) : (
						<p className='text-md text-foreground'>{formatPrice(price)}</p>
					)}
				</div>
			</div>
		</Link>
	);
};

export default CourseCard;
