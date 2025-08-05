"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PencilIcon, ImageIcon, X, PlusIcon } from "lucide-react";
import type { Course } from "@/lib/generated/prisma/wasm";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
	imageUrl: z.string().min(1, {
		message: "The image is required",
	}),
});

interface ImageFormProps {
	initialData: Course;
	courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			imageUrl: initialData.imageUrl || "",
		},
	});

	const { isSubmitting } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast("The image has been submitted successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast("Something went wrong while updating the description of a course.");
		}
	};

	return (
		<div className='group overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-lg shadow-sm'>
							<ImageIcon className='h-4 w-4 text-foreground' />
						</div>
						<div>
							<h3 className='font-semibold text-foreground'>Course Image</h3>
							<p className='text-sm text-foreground'>
								Upload a compelling image for your course
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
						{isEditing && (
							<>
								<X className='h-4 w-4 mr-2' />
								Cancel
							</>
						)}
						{!isEditing && !initialData.imageUrl && (
							<>
								<PlusIcon className='h-4 w-4 mr-2' />
								Add an Image
							</>
						)}
						{!isEditing && initialData.imageUrl && (
							<>
								<PencilIcon className='h-4 w-4 mr-2' />
								Edit Image
							</>
						)}
					</Button>
				</div>
			</div>
			{/* Content */}
			<div className='p-6'>
				{!isEditing &&
					(!initialData.imageUrl ? (
						<div className='flex flex-col items-center justify-center h-60'>
							<div className='p-4 mb-4'>
								<ImageIcon className='h-8 w-8 text-foreground' />
							</div>
							<h4 className='text-lg font-medium text-foreground mb-2'>
								No image uploaded
							</h4>
							<p className='text-sm text-foreground text-center max-w-sm'>
								Add an eye-catching image to make your course more appealing to
								students
							</p>
						</div>
					) : (
						<div className='space-y-3'>
							<div className='relative aspect-video mt-2'>
								<Image
									src={initialData.imageUrl}
									alt='Course image'
									fill
									className='object-cover rounded-lg border border-slate-200'
								/>
							</div>
							<p className='text-xs text-foreground'>
								Click edit to change your course image
							</p>
						</div>
					))}
				{isEditing && (
					<div className='space-y-4'>
						<FileUpload
							endPoint='courseImage'
							onChange={(url) => {
								if (url) {
									onSubmit({ imageUrl: url });
								}
							}}
						/>
						<div className='text-sm text-foreground p-3'>
							<span className='font-medium'>💡 Tip:</span> 16:9 aspect ratio
							recommended for best results
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageForm;
