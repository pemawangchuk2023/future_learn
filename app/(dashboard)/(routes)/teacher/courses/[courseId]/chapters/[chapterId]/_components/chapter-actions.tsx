"use client";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ChapterActionsProps {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean;
}

const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: ChapterActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const onDelete = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
			toast("The chapter has been deleted successfully");
			router.refresh();
			router.push(`/teacher/courses/${courseId}`);
		} catch (error) {
			console.log(error);
			toast("Something went wrong when deleting");
		}
	};
	const onClick = async () => {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/unpublish`
				);
				toast("The chapter has been unpublished");
			} else {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/publish`
				);
				toast("The chapter has been published");
			}
			router.refresh();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='flex items-center gap-x-2'>
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant='outline'
				size='sm'
			>
				{isPublished ? "Unpublished" : "Publish"}
			</Button>

			<ConfirmModal onConfirm={onDelete}>
				<Button
					size='sm'
					disabled={isLoading}
					variant='destructive'
					className='cursor-pointer'
				>
					<Trash2Icon className='h-4 w-4' />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default ChapterActions;
