"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface CourseSidebarItemsProps {
	id: string;
	label: string;
	isCompleted: boolean;
	courseId: string;
	isLocked: boolean;
}

const CourseSidebarItem = ({
	id,
	label,
	isCompleted,
	courseId,
	isLocked,
}: CourseSidebarItemsProps) => {
	const pathname = usePathname();
	const router = useRouter();

	const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

	const isActive = pathname?.includes(id);

	const onClick = () => {
		router.push(`/courses/${courseId}/chapters/${id}`);
	};

	return (
		<button
			onClick={onClick}
			type='button'
			className={cn(
				"flex items-center gap-x-2 font-medium pl-6 w-full text-left transition-colors",
				isActive && "bg-muted",
				isCompleted && !isActive && "text-emerald-600 dark:text-emerald-400",
				!isActive &&
					!isCompleted &&
					"text-muted-foreground hover:text-foreground"
			)}
		>
			<div className='flex items-center gap-x-2 py-4'>
				<Icon
					size={22}
					className={cn(
						"text-muted-foreground",
						isCompleted && "text-emerald-600 dark:text-emerald-400",
						isActive && !isCompleted && "text-primary"
					)}
				/>
				{label}
			</div>
		</button>
	);
};

export default CourseSidebarItem;
