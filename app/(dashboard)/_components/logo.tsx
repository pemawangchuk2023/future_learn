"use client";

import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";

const Logo = () => {
	const { theme } = useTheme();

	const logoSrc =
		theme === "dark" ? "/assets/darklogo.png" : "/assets/whitelogo.png";

	return (
		<div>
			<Image src={logoSrc} alt='logo' height={130} width={130} priority />
		</div>
	);
};

export default Logo;
