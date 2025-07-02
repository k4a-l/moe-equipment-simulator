import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
	title: "MoE 装備シミュレーター",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head></head>
			<body>{children}</body>
		</html>
	);
}
