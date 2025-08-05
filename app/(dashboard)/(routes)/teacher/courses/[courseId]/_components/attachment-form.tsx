"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon, X, PlusCircle } from "lucide-react";
import type { Course, Attachment } from "@/lib/generated/prisma/wasm";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
	url: z.string().min(1, { message: "Attachment URL is required" }),
});

interface AttachmentFormProps {
	initialData: Course & { attachments: Attachment[] };
	courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: "",
		},
	});

	const { isSubmitting } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, values);
			toast.success("The attachment has been uploaded successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast.error("Something went wrong when uploading the attachment.");
		}
	};

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id);
			await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
			toast.success("Attachment deleted successfully");
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong when deleting the attachment.");
			console.log(error);
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className='group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden'>
			{/* Header */}
			<div className='bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-white rounded-lg shadow-sm'>
							<ImageIcon className='h-4 w-4 text-slate-600' />
						</div>
						<div>
							<h3 className='font-semibold text-slate-900'>
								Course Attachment
							</h3>
							<p className='text-xs text-slate-500'>Upload an Attachment</p>
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
								<PlusCircle className='h-4 w-4 mr-2' />
								Add
							</>
						)}
					</Button>
				</div>
			</div>
			{/* Content */}
			<div className='p-6'>
				{!isEditing && (
					<>
						{initialData.attachments.length === 0 ? (
							<p className='text-sm mt-2 text-slate-500 italic'>
								No attachments yet
							</p>
						) : (
							<div className='space-y-2'>
								{initialData.attachments.map((attachment) => (
									<div
										key={attachment.id}
										className='flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200'
									>
										<p className='text-sm text-slate-700 truncate'>
											{attachment.name || attachment.url}
										</p>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => onDelete(attachment.id)}
											disabled={deletingId === attachment.id}
											className='text-red-500 hover:text-red-700 cursor-pointer'
										>
											<X className='h-4 w-4' />
										</Button>
									</div>
								))}
							</div>
						)}
					</>
				)}
				{isEditing && (
					<div className='space-y-4'>
						<FileUpload
							endPoint='courseAttachment'
							onChange={(url) => {
								if (url) {
									onSubmit({ url });
								}
							}}
						/>
						<div className='text-xs text-foreground bg-slate-50 p-3 rounded-lg border border-slate-200'>
							<span className='font-medium'>
								Add anything that your students might need to complete this
								course
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AttachmentForm;
