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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PencilIcon, FileText, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chapter } from "@/lib/generated/prisma";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Preview from "@/components/editor/Preview";

const Editor = dynamic(() => import("@/components/editor"), {
	ssr: false,
});

const formSchema = z.object({
	description: z.string().min(1, {
		message: "The description is required",
	}),
});

interface ChapterDescriptionFormProps {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
}

const ChapterDescriptionForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterDescriptionFormProps) => {
	const editorRef = useRef<MDXEditorMethods>(null);
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
			<div className='px-6 py-4 '>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div>
							<h3 className='font-extrabold text-xl text-yellow-500'>
								2. Enter the Description of Chapter
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
					<div className='space-y-2'>
						<div
							className={cn(
								"text-foreground leading-relaxed",
								!initialData.description && "text-foreground italic"
							)}
						>
							{/* {initialData.description && (
								<Preview content={initialData.description} />
							)} */}
						</div>
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
											Chapter Description
										</FormLabel>
										<FormControl>
											<Editor
												value={field.value}
												editorRef={editorRef}
												fieldChange={field.onChange}
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

export default ChapterDescriptionForm;
