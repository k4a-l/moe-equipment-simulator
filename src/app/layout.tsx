import type { Metadata } from "next";
import { NavigationTab } from "@/features/route/NavigationTab";
import "./globals.css";

import { QueryClient } from "@tanstack/react-query";
import Provider from "@/features/app/Provider";

export const metadata: Metadata = {
	title: "MoE 装備シミュレーター | MoEq",
};

const queryClient = new QueryClient();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon/favicon-16x16.png"
				/>
				<link rel="manifest" href="/favicon/site.webmanifest" />
				<link
					rel="mask-icon"
					href="/favicon/safari-pinned-tab.svg"
					color="#5bbad5"
				/>
				<meta name="msapplication-TileColor" content="#2b5797" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body>
				<Provider>
					<div className="flex justify-center p-2 bg-gray-50 min-h-screen">
						<div className="flex flex-col p-2 max-w-11/12 w-full">
							<div className="flex gap-2 w-auto ">
								<NavigationTab />
							</div>
							<div className="pt-2">{children}</div>
						</div>
					</div>
				</Provider>
			</body>
		</html>
	);
}
