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
import { PencilIcon, FileText, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/lib/generated/prisma";

const formSchema = z.object({
	description: z.string().min(1, {
		message: "The description is required",
	}),
});

interface DescriptionFormProps {
	initialData: Course;
	courseId: string;
}

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData.description || "",
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast("The description has been updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast("Something went wrong while updating the description of a course.");
		}
	};

	return (
		<div className='group rounded-xl border overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='p-2'>
							<FileText className='h-4 w-4 text-slate-foreground' />
						</div>
						<div>
							<h3 className='font-semibold text-foreground'>
								Course Description
							</h3>
							<p className='text-sm text-foreground'>
								Describe what students will learn
							</p>
						</div>
					</div>
					<Button
						variant='ghost'
						size='sm'
						onClick={toggleEdit}
						disabled={isSubmitting}
						className='hover:bg-white/80 transition-colors'
					>
						{isEditing ? (
							<>
								<X className='h-4 w-4 mr-2' />
								Cancel
							</>
						) : (
							<>
								<PencilIcon className='h-4 w-4 mr-2' />
								Edit
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className='p-6'>
				{!isEditing && (
					<div className='space-y-2'>
						<div
							className={cn(
								"text-foreground leading-relaxed",
								!initialData.description && "text-slate-400 italic"
							)}
						>
							{initialData.description ||
								"No description provided yet. Click edit to add a compelling description for your course."}
						</div>
						{initialData.description && (
							<p className='text-sm text-foreground'>
								Click edit to modify your course description
							</p>
						)}
					</div>
				)}

				{isEditing && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground font-medium'>
											Course Description
										</FormLabel>
										<FormControl>
											<Textarea
												disabled={isSubmitting}
												placeholder='e.g. "This comprehensive course will teach you advanced React concepts including hooks, context, performance optimization, and modern patterns..."'
												className='border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 min-h-[120px] resize-none'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex items-center gap-2 pt-2'>
								<Button
									type='submit'
									disabled={!isValid || isSubmitting}
									size='sm'
									className='bg-blue-600 hover:bg-blue-700 text-foreground'
								>
									<Check className='h-4 w-4 mr-2' />
									Save Changes
								</Button>
							</div>
						</form>
					</Form>
				)}
			</div>
		</div>
	);
};

export default DescriptionForm;
