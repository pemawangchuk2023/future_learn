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
import { Course } from "@/lib/generated/prisma";
import Combobox from "@/components/ui/combobox";

const formSchema = z.object({
	categoryId: z.string().min(1),
});

interface CategoryFormProps {
	initialData: Course;
	courseId: string;
	options: { label: string; value: string }[];
}

const CategoryForm = ({
	initialData,
	courseId,
	options,
}: CategoryFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryId: initialData.categoryId || "",
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

	const selectedOption = options.find(
		(option) => option.value === initialData.categoryId
	);

	return (
		<div className='group duration-200 overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='p-2'>
							<FileText className='h-4 w-4 text-foreground' />
						</div>
						<div>
							<h3 className='font-semibold text-foreground'>
								Category Description
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
								!initialData.categoryId && "text-foreground italic"
							)}
						>
							{selectedOption?.label ||
								"No categoryId provided yet. Click edit to add a compelling description for your course."}
						</div>
						{initialData.categoryId && (
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
								name='categoryId'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground font-medium'>
											Course Category
										</FormLabel>
										<FormControl>
											<Combobox options={options} {...field} />
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

export default CategoryForm;
