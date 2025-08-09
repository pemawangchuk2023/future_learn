"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariant = cva(
	// base styles for the INDICATOR
	"h-full w-full flex-1 transition-all",
	{
		variants: {
			color: {
				primary: "bg-primary",
				secondary: "bg-secondary",
				muted: "bg-muted",
				success: "bg-green-500 dark:bg-green-400",
				warning: "bg-amber-500 dark:bg-amber-400",
				destructive: "bg-destructive",
			},
			rounded: {
				none: "",
				sm: "rounded",
				md: "rounded-md",
				lg: "rounded-lg",
				full: "rounded-full",
			},
			striped: {
				true: "bg-[linear-gradient(45deg,rgba(255,255,255,.2)25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] [background-size:1rem_1rem]",
			},
		},
		defaultVariants: {
			color: "primary",
			rounded: "full",
		},
	}
);

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
	VariantProps<typeof progressVariant> & {
		trackClassName?: string;
	};

function Progress({
	className,
	trackClassName,
	value,
	color,
	rounded,
	striped,
	...props
}: ProgressProps) {
	return (
		<ProgressPrimitive.Root
			data-slot='progress'
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/60",
				className,
				rounded && progressVariant({ rounded }).replace("bg-primary", "")
			)}
			{...props}
		>
			<div className={cn("absolute inset-0", trackClassName)} />
			<ProgressPrimitive.Indicator
				data-slot='progress-indicator'
				className={cn(progressVariant({ color, rounded, striped }))}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress, progressVariant };
