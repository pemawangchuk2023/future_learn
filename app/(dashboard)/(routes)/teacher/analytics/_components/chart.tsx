"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";

interface ChartProps {
	data: {
		name: string;
		total: number;
	}[];
	title?: string;
	description?: string;
}

const chartConfig: ChartConfig = {
	total: {
		label: "Total",
		color: "var(--chart-1)",
	},
};

const Chart = ({
	data,
	title = "Overview",
	description = "Recent performance",
}: ChartProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChartContainer config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={data}
						margin={{ top: 10, left: 20, right: 20, bottom: 10 }}
					>
						<CartesianGrid strokeDasharray='3 3' />

						{/* Y-Axis */}
						<YAxis tickLine={false} axisLine={false} tickMargin={8} />

						{/* X-Axis */}
						<XAxis
							dataKey='name'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value: string) => value?.slice(0, 3)}
						/>

						{/* Tooltip */}
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dot' />}
						/>

						{/* Area */}
						<Area
							dataKey='total'
							type='natural'
							fill='var(--color-total)'
							fillOpacity={0.4}
							stroke='var(--color-total)'
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default Chart;
