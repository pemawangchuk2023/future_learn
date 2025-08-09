"use client";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface ActionsProps {
	disabled: boolean;
	courseId: string;
	isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const confetti = useConfettiStore();

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}`);
			toast("The course has been deleted successfully");
			router.refresh();
			router.push(`/teacher/courses`);
		} catch (error) {
			console.log(error);
			toast("Something went wrong when deleting");
		}
	};
	const onClick = async () => {
		try {
			setIsLoading(true);
			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`);
				toast("The chapter has been unpublished");
				confetti.onOpen();
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);
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
		<div className='flex items-center gap-x-2 mt-2'>
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant='outline'
				size='sm'
				className='rounded-none cursor-pointer'
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

export default Actions;
