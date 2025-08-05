"use client";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PencilIcon, Type, Check, X } from "lucide-react";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "The title is required",
	}),
});

interface TitleFormProps {
	initialData: {
		title: string;
	};
	courseId: string;
}

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const { isSubmitting, isValid } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast("The course has been updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast("Something went wrong while updating the course title.");
		}
	};

	return (
		<div className='group rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4 border-b'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div>
							<h3 className='font-semibold text-foreground'>Course Title</h3>
							<p className='text-xs text-foreground capitalize'>
								Give your course a compelling title
							</p>
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
						<p className='text-foreground font-medium text-xl'>
							{initialData.title}
						</p>
						<p className='text-xs text-foreground capitalize'>
							Click edit to modify your course title
						</p>
					</div>
				)}

				{isEditing && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground font-medium'>
											Course Title
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='e.g. "Advanced React Development"'
												disabled={isSubmitting}
												className='border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
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
									className='bg-blue-600 hover:bg-blue-700 text-foreground'
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

export default TitleForm;
