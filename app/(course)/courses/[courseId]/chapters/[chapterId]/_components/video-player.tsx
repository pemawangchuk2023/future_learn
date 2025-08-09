"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";

import React, { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { toast } from "sonner";

interface VideoPlayerProps {
	chapterId: string;
	title: string;
	courseId: string;
	nextChapterId?: string;
	playbackId?: string;
	isLocked: boolean;
	completeOnEnd: boolean;
}

const VideoPlayer = ({
	chapterId,
	title,
	courseId,
	nextChapterId,
	playbackId,
	isLocked,
	completeOnEnd,
}: VideoPlayerProps) => {
	const router = useRouter();
	const confetti = useConfettiStore();
	const [isReady, setIsReady] = useState(false);

	const onEnd = async () => {
		try {
			if (!completeOnEnd) {
				await axios.put(
					`/api/courses/${courseId}/chapters/${chapterId}/progress`,
					{
						isCompleted: true,
					}
				);
			}
			if (!nextChapterId) {
				confetti.onOpen();
			}

			toast("The progress has been updated");
			router.refresh();

			if (nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
			}
		} catch (error) {
			console.log(error);
			toast("Something went wrong");
		}
	};

	return (
		<div className='relative aspect-video'>
			{!isLocked && !isReady && (
				<div className='absolute inset-0 flex items-center justify-center'>
					<Loader2 className='h-8 w-8 animate-spin text-secondary' />
				</div>
			)}
			{isLocked && (
				<div className='absolute inset-0 flex items-center justify-center bg-yellow-500 flex-col gap-y-2'>
					<Lock className='h-8 w-8' />
					<p className='text-sm'>The chapter is locked</p>
				</div>
			)}
			{!isLocked && (
				<MuxPlayer
					title={title}
					className={cn(!isReady && "hidden")}
					onCanPlay={() => setIsReady(true)}
					onEnded={onEnd}
					autoPlay
					playbackId={playbackId}
				/>
			)}
		</div>
	);
};

export default VideoPlayer;
