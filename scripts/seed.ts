import { PrismaClient } from "../lib/generated/prisma/index.js";

const database = new PrismaClient();
export async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: "Computer Science" },
				{ name: "Blockchain" },
				{ name: "Artificial Intelligence" },
				{ name: "Web Development" },
				{ name: "Accounting" },
			],
			skipDuplicates: true,
		});
	} catch (error) {
		console.log("Error seeding the database", error);
	} finally {
		await database.$disconnect();
	}
}

main();
