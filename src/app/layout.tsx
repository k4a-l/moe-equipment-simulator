import type { Metadata } from "next";
import { NavigationTab } from "@/features/route/NavigationTab";
import "./globals.css";

import { QueryClient } from "@tanstack/react-query";
import Provider from "@/features/app/Provider";

export const metadata: Metadata = {
	title: "MoE 装備シミュレーター",
};

const queryClient = new QueryClient();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head></head>
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
