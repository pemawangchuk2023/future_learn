import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
	variant?: "default" | "success";
	value: number;
	size?: "default" | "sm";
}

const colorByVariant = {
	default: "text-sky-600 dark:text-sky-400",
	success: "text-emerald-600 dark:text-emerald-400",
};

const heightBySize = {
	default: "h-3",
	sm: "h-2",
};

const CourseProgress = ({
	variant = "default",
	value,
	size = "default",
}: CourseProgressProps) => {
	return (
		<div className='w-full space-y-3'>
			<Progress
				value={value}
				className={cn(
					heightBySize[size],
					"bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-all duration-300"
				)}
				style={
					{
						"--progress-indicator-color":
							variant === "success" ? "rgb(34 197 94)" : "rgb(14 165 233)",
					} as React.CSSProperties
				}
			/>
			<p
				className={cn(
					"text-sm font-medium text-center transition-colors duration-200",
					colorByVariant[variant]
				)}
			>
				{Math.round(value)}% complete
			</p>
		</div>
	);
};

export default CourseProgress;
