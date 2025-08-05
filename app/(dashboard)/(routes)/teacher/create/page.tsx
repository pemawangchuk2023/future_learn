"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "The title is required",
	}),
});
const CreatePage = () => {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});
	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.post("/api/courses", values);
			router.push(`/teacher/courses/${response.data.id}`);
			toast("The course was created successfully");
		} catch (error) {
			toast("Something went wrong");
			console.log("There was an error", error);
		}
	};
	return (
		<div className='max-w-5xl mx-auto flex items-center md:justify-center h-full p-6'>
			<div>
				<h1 className='text-2xl'>Name Your Course</h1>
				<p className='text-sm text-slate-600'>
					What would you like to name your course? You can still change this
					later.
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder='Entrepreneurship, Leadership, Web Development'
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What Will You Teach In This Course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex items-center gap-x-2'>
							<Link href='/'>
								<Button variant='ghost' type='button'>
									Cancel
								</Button>
							</Link>
							<Button type='submit' disabled={!isValid || isSubmitting}>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreatePage;
