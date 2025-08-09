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
import { useRouter } from "next/navigation";
import { PencilIcon, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/lib/generated/prisma";
import { Input } from "@/components/ui/input";
import { formatPrice } from "../../../../../../../lib/format";

const formSchema = z.object({
	price: z.number().min(1, { message: "Price must be at least 1" }),
});

interface PriceFormProps {
	initialData: Course;
	courseId: string;
}

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: initialData?.price ?? 0,
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);
			toast("The price has been updated successfully");
			toggleEdit();
			router.refresh();
		} catch {
			toast("Something went wrong while updating the price of a course.");
		}
	};

	return (
		<div className='group overflow-hidden'>
			{/* Header */}
			<div className='px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div>
							<h3 className='font-extrabold text-yellow-500 text-xl mb-2'>
								6. Fix the Price of Your Course
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
								Edit Price
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
								"text-foreground",
								!initialData.price && "text-foreground italic"
							)}
						>
							{formatPrice(initialData.price ?? 0)}
						</div>
					</div>
				)}

				{isEditing && (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='price'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground font-medium'>
											Price
										</FormLabel>
										<FormControl>
											<Input
												disabled={isSubmitting}
												{...field}
												type='number'
												step='0.01'
												placeholder='Set a price for your course'
												onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
									className='text-foreground rounded-none px-6 cursor-pointer'
									variant='outline'
								>
									<Check className='h-4 w-4 mr-2' />
									Save The Price
								</Button>
							</div>
						</form>
					</Form>
				)}
			</div>
		</div>
	);
};

export default PriceForm;
