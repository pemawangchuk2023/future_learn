"use client";
import CategoryItem from "@/app/(dashboard)/(routes)/search/_components/category-item";
import { Category } from "@/lib/generated/prisma";
import React from "react";

import {
	FaRegChartBar,
	FaBrain,
	FaLaptopCode,
	FaCode,
	FaBitcoin,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface CategoriesProps {
	items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
	Accounting: FaRegChartBar,
	"Artificial Intelligence": FaBrain,
	"Web Development": FaCode,
	"Computer Science": FaLaptopCode,
	Blockchain: FaBitcoin,
};

const Categories = ({ items }: CategoriesProps) => {
	return (
		<div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
			{items.map((item) => (
				<CategoryItem
					key={item.id}
					label={item.name}
					icon={iconMap[item.name]}
					value={item.id}
				/>
			))}
		</div>
	);
};

export default Categories;
