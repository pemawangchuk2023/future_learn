"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PencilIcon, FileText, Check, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@/lib/generated/prisma";
import { Input } from "@/components/ui/input";
import ChapterList from "@/app/(dashboard)/_components/chapters-list";

const formSchema = z.object({
	title: z.string().min(1, "Chapter title is required"),
});

interface ChaptersFormProps {
	initialData: Course & { chapters: Chapter[] };
	courseId: string;
}

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const toggleCreate = () => setIsCreating((current) => !current);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
		mode: "onChange",
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/chapters`, values);
			toast.success("Chapter title created successfully");
			toggleCreate();
			router.refresh();
			form.reset();
		} catch {
			toast.error("Something went wrong while creating the chapter.");
		}
	};

	const onReorder = async (updateData: { id: string; position: number }[]) => {
		try {
			setIsUpdating(true);
			await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
				chapters: updateData,
			});
			toast.success("Chapters reordered successfully");
			router.refresh();
		} catch {
			toast.error("Failed to reorder chapters");
		} finally {
			setIsUpdating(false);
		}
	};

	const onEdit = (id: string) => {
		router.push(`/teacher/courses/${courseId}/chapters/${id}`);
	};

	return (
		<div className='group overflow-hidden'>
			{/* Loader */}
			{isUpdating && (
				<div className='absolute inset-0 flex items-center justify-center z-10'>
					<Loader className='animate-spin h-8 w-8 text-blue-500' />
				</div>
			)}

			{/* Header */}
			<div className='px-8 py-5'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<div>
							<h3 className='font-extrabold text-yellow-500 text-xl'>
								5. Add the Chapters of Your Course
							</h3>
						</div>
					</div>
					<Button
						variant='ghost'
						size='sm'
						onClick={toggleCreate}
						disabled={isSubmitting}
						className={cn(
							"flex items-center gap-2",
							isCreating && "border-blue-300"
						)}
						aria-label={isCreating ? "Cancel creating chapter" : "Add chapter"}
					>
						{isCreating ? (
							<>
								<X className='h-4 w-4' />
								Cancel
							</>
						) : (
							<>
								<PencilIcon className='h-4 w-4' />
								Add Chapter
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className='p-8'>
				{isCreating && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground font-semibold mb-2'>
											Add the Title of Your Chapter
										</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												placeholder='e.g. Introduction'
												className='border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 min-h-[42px] text-base'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex items-center gap-3 pt-2'>
								<Button
									type='submit'
									disabled={!isValid || isSubmitting}
									size='sm'
									className='text-foreground rounded-none px-6 cursor-pointer'
									variant='outline'
								>
									<Check className='h-4 w-4 mr-1' />
									Create
								</Button>
							</div>
						</form>
					</Form>
				)}

				{!isCreating && (
					<div
						className={cn(
							"mt-1",
							!initialData.chapters.length && "text-slate-500 italic"
						)}
					>
						{!initialData.chapters.length && "No chapters yet."}
						<ChapterList
							onEdit={onEdit}
							onReorder={onReorder}
							items={initialData.chapters || []}
						/>
					</div>
				)}
				{!isCreating && initialData.chapters.length > 1 && (
					<p className='text-xs text-red-500 capitalize mt-6 font-extrabold'>
						Drag and drop to reorder chapters
					</p>
				)}
			</div>
		</div>
	);
};

export default ChaptersForm;
