"use client";
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PencilIcon, ImageIcon, X, PlusIcon, Video } from "lucide-react";
import type { Chapter, MuxData } from "@/lib/generated/prisma/wasm";
import FileUpload from "@/components/file-upload";

const formSchema = z.object({
	videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
	initialData: Chapter & { muxData?: MuxData | null };
	courseId: string;
	chapterId: string;
}

const ChapterVideoForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterVideoFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			videoUrl: initialData.videoUrl || "",
		},
	});

	const { isSubmitting } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);
			toast("The video has been submitted successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast("Something went wrong while uploading the video");
		}
	};

	return (
		<div className='group  overflow-hidden'>
			{/* Header */}
			<div className=' px-6 py-4 '>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='p-2'>
							<ImageIcon className='h-4 w-4 text-foreground' />
						</div>
						<div>
							<h3 className='font-semibold text-foreground'>Chapter Video</h3>
							<p className='text-sm text-foreground'>
								Upload a compelling video for your course
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
						{!isEditing && !initialData.videoUrl && (
							<>
								<PlusIcon className='h-4 w-4 mr-2' />
								Add a Video
							</>
						)}
						{!isEditing && initialData.videoUrl && (
							<>
								<PencilIcon className='h-4 w-4 mr-2' />
								Edit Video
							</>
						)}
					</Button>
				</div>
			</div>
			{/* Content */}
			<div className='p-6'>
				{!isEditing &&
					(!initialData.videoUrl ? (
						<div className='flex flex-col items-center justify-center h-60'>
							<div className='p-4  mb-4'>
								<Video className='h-8 w-8 text-foreground' />
							</div>
							<h4 className='text-lg font-medium text-foreground mb-2'>
								No video uploaded
							</h4>
						</div>
					) : (
						<div className='space-y-3'>
							{initialData.muxData?.playbackId ? (
								<div className='relative aspect-video mt-2'>
									<MuxPlayer
										playbackId={initialData.muxData.playbackId}
										className='rounded-lg border border-slate-200'
									/>
								</div>
							) : (
								<div className='flex flex-col items-center justify-center h-60 '>
									<div className='p-4 rounded-full shadow-sm mb-4'>
										<Video className='h-8 w-8 text-foreground' />
									</div>
									<h4 className='text-lg font-medium text-foreground mb-2'>
										Video is processing
									</h4>
								</div>
							)}
							<p className='text-sm text-foreground'>
								Click edit to change your course video
							</p>
						</div>
					))}
				{isEditing && (
					<div className='space-y-4'>
						<FileUpload
							endPoint='chapterVideo'
							onChange={(url) => {
								if (url) {
									onSubmit({ videoUrl: url });
								}
							}}
						/>
						<div className='text-xs text-foreground p-3 rounded-lg'>
							Upload this chapter&apos;s video
						</div>
					</div>
				)}
				{initialData.videoUrl && !isEditing && (
					<div className='text-xs text-foreground mt-2'>
						Videos can take a few minutes to process. Refresh the page if the
						video does not appear.
					</div>
				)}
			</div>
		</div>
	);
};

export default ChapterVideoForm;
