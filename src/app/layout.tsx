import "@mantine/core/styles.css";
import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "MoE 装備シミュレーター",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider>{children}</MantineProvider>
			</body>
		</html>
	);
}
