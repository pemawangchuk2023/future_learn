import type { Metadata } from "next";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import ConfettiProvider from "@/components/providers/confetti-provider";
import { ThemeProvider } from "@/components/themes/theme-provider";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
	title: "FutureLearn - Learn, Grow, Succeed",
	description:
		"FutureLearn is a modern learning platform designed to empower individuals with skills, knowledge, and resources to excel in their personal and professional journeys.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en' className={poppins.variable}>
				<body>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						disableTransitionOnChange
					>
						<header className='flex justify-end items-center p-4 gap-4 h-16'>
							<SignedOut>
								<SignInButton />
								<SignUpButton>
									<button className='bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer'>
										Sign Up
									</button>
								</SignUpButton>
							</SignedOut>
							<SignedIn>
								<UserButton />
							</SignedIn>
						</header>
						{children}
						<ConfettiProvider />
						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
