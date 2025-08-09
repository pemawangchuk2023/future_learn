import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import InfoCard from "@/app/(dashboard)/(routes)/(root)/_components/info-card";
import CoursesLists from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
	const { userId } = await auth();
	if (!userId) {
		return redirect("/");
	}

	const { completedCourses, courseInProgress } = await getDashboardCourses(
		userId
	);
	return (
		<div className='p-6 space-y-4'>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				<div>
					<InfoCard
						icon={Clock}
						label='In Progress'
						numberOfItems={courseInProgress.length}
					/>
				</div>
				<div>
					<InfoCard
						icon={CheckCircle}
						label='In Progress'
						numberOfItems={completedCourses.length}
						variant='success'
					/>
				</div>
			</div>
			<CoursesLists items={[...courseInProgress, ...completedCourses]} />
		</div>
	);
};

export default Dashboard;
