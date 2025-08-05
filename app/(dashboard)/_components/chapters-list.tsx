"use client";
import { Chapter } from "@/lib/generated/prisma";
import React, { useEffect, useState } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { on } from "events";

interface ChaptersListProps {
	items: Chapter[];
	onReorder: (updateData: { id: string; position: number }[]) => void;
	onEdit: (id: string) => void;
}

const ChapterList = ({ items, onReorder, onEdit }: ChaptersListProps) => {
	const [isMounted, setIsMounted] = useState(false);
	const [chapters, setChapters] = useState(items);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setChapters(items);
	}, [items]);

	if (!isMounted) {
		return null;
	}
	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(chapters);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		const startIndex = Math.min(result.source.index, result.destination.index);
		const endIndex = Math.max(result.source.index, result.destination.index);

		const updatedChapters = items.slice(startIndex, endIndex + 1);
		setChapters(items);

		const bulkUpdateData = updatedChapters.map((chapter) => ({
			id: chapter.id,
			position: items.findIndex((item) => item.id === chapter.id),
		}));
		onReorder(bulkUpdateData);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='chapters'>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{chapters.map((chapter, index) => (
							<Draggable
								key={chapter.id}
								draggableId={chapter.id}
								index={index}
							>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										className={cn(
											"flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm p-2 cursor-pointer",
											chapter.isPublished &&
												"bg-sky-100 border-sky-200 text-sky-700"
										)}
										onClick={() => onEdit(chapter.id)}
									>
										<Grip className='h-5 w-5' />
										<span>{chapter.title}</span>
										<div className='ml-auto pr-2 flex items-center gap-x-2'>
											{chapter.isFree && <Badge>Free</Badge>}
											<Badge
												className={cn(
													"bg-slate-500",
													chapter.isPublished && "bg-sky-700"
												)}
											>
												{chapter.isPublished ? "Published" : "Draft"}
											</Badge>
											<PencilIcon
												className='h-5 w-5 cursor-pointer text-slate-500 hover:text-slate-700 transition-colors duration-200'
												onClick={() => onEdit(chapter.id)}
											/>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default ChapterList;
