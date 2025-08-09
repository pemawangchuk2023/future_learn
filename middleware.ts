import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/api/webhook(.*)",
	"/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	// Skip auth for public routes
	if (isPublicRoute(req)) return;

	// Protect everything else
	await auth.protect();
});

export const config = {
	matcher: [
		// Skip Next.js internals and static assets
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
