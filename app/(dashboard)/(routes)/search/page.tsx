import { getCourses } from "@/actions/get-courses";
import Categories from "@/app/(dashboard)/(routes)/search/_components/categories";
import SearchInput from "@/app/(dashboard)/(routes)/search/_components/search-input";
import CoursesLists from "@/components/courses-list";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface SearchPageProps {
	searchParams: Promise<{
		title: string;
		categoryId: string;
	}>;
}
const Search = async ({ searchParams }: SearchPageProps) => {
	const { userId } = await auth();
	const courseParams = await searchParams;
	if (!userId) {
		return redirect("/");
	}
	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});
	const courses = await getCourses({
		userId,
		...courseParams,
	});
	return (
		<>
			<div className='px-6 pt-6 md:hidden md:mb-0 block'>
				<SearchInput />
			</div>
			<div className='p-6 space-y-4'>
				<Categories items={categories} />
			</div>

			<CoursesLists items={courses} />
		</>
	);
};

export default Search;
