"use client";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const SearchInput = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [value, setValue] = useState("");
	const debouncedValue = useDebounce(value);

	const currentCategoryId = searchParams.get("categoryId");

	useEffect(() => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					categoryId: currentCategoryId,
					title: debouncedValue,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);
		router.push(url);
	}, [debouncedValue, currentCategoryId, router, pathname]);

	return (
		<div className='relative'>
			<SearchIcon className='h-4 w-4 absolute top-3 left-3 text-foreground' />
			<Input
				onChange={(e) => setValue(e.target.value)}
				className='w-full md:w-[300px] pl-9 rounded-full'
				placeholder='Search for courses'
			/>
		</div>
	);
};

export default SearchInput;
