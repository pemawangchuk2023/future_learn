"use client";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PencilIcon, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter } from "@/lib/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
	isFree: z.boolean(),
});

interface ChapterAccessFormProps {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
}

const ChapterAccessForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterAccessFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: !!initialData.isFree,
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);
			toast("The chapter has been updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast(
				"Something went wrong while updating the description of a chapter."
			);
		}
	};

	return (
		<div className='group overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div>
							<h3 className='font-extrabold text-xl text-yellow-500'>
								3. Provide Chapter Access
							</h3>
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
					<div
						className={cn(
							"text-sm mt-2",
							!initialData.isFree && "text-foreground italic"
						)}
					>
						{initialData.isFree ? (
							<>This chapter is free for preview</>
						) : (
							<>This chapter is not free</>
						)}
					</div>
				)}

				{isEditing && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='isFree'
								render={({ field }) => (
									<FormItem className='flex flex-row items-start space-x-3 space-y-3 rounded-md border p-4'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormDescription>
											Check this box if you want to make this chapter free for
											preview
										</FormDescription>
									</FormItem>
								)}
							/>
							<div className='flex items-center gap-2 pt-2'>
								<Button
									type='submit'
									disabled={!isValid || isSubmitting}
									size='sm'
									variant='outline'
									className='cursor-pointer rounded-none border-2 border-amber-200'
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

export default ChapterAccessForm;
