"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
	const [isEditing, setIsEditing] = useState(false);
	const [localImageUrl, setLocalImageUrl] = useState(
		initialData.imageUrl || ""
	);

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
			const response = await axios.patch(`/api/courses/${courseId}`, values);
			console.log("PATCH response:", response.data);
			toast("The image has been submitted successfully");
			setLocalImageUrl(values.imageUrl);
			form.setValue("imageUrl", values.imageUrl);
			toggleEdit();
		} catch (error) {
			console.error("Error updating course image:", error);
			toast("Something went wrong while updating the course image.");
		}
	};

	return (
		<div className='group overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div>
							<h3 className='font-extrabold text-yellow-500 text-xl'>
								3.Upload the Image of Your Course
							</h3>
						</div>
					</div>
					<Button
						variant='ghost'
						size='sm'
						onClick={toggleEdit}
						disabled={isSubmitting}
						className='cursor-pointer'
					>
						{isEditing && (
							<>
								<X className='h-4 w-4 mr-2' />
								Cancel
							</>
						)}
						{!isEditing && !localImageUrl && (
							<>
								<PlusIcon className='h-4 w-4 mr-2' />
								Add an Image
							</>
						)}
						{!isEditing && localImageUrl && (
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
					(!localImageUrl ? (
						<div className='flex flex-col items-center justify-center h-60'>
							<div className='p-4 mb-4'>
								<ImageIcon className='h-8 w-8 text-foreground' />
							</div>
							<h4 className='text-lg font-medium text-foreground mb-2'>
								No image uploaded
							</h4>
						</div>
					) : (
						<div className='space-y-3'>
							<div className='relative aspect-video mt-2'>
								<Image src={localImageUrl} alt='Course image' fill />
							</div>
						</div>
					))}
				{isEditing && (
					<div className='space-y-4 text-foreground'>
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
