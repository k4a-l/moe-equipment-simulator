import type { Metadata } from "next";
import { NavigationTab } from "@/features/route/NavigationTab";
import "./globals.css";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Provider from "@/features/app/Provider";

export const metadata: Metadata = {
	title: "MoE 装備シミュレーター | MoEq",
};

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
				{/* OGP */}
				<meta property="og:type" content="website" />
				<meta property="og:title" content="MoEq - MoE 装備シミュレーター" />
				<meta
					property="og:description"
					content="Master of Epicの装備シミュレーターです。任意のステータスでの検索も可能です。"
				/>
				<meta
					property="og:url"
					content="https://moe-equipment-simulator.k4a.me"
				/>
				<meta property="og:site_name" content="MoEq - MoE 装備シミュレーター" />
				<meta
					property="og:image"
					content="https://moe-equipment-simulator.k4a.me/favicon/apple-touch-icon.png"
				/>
				{/* Twitter */}
				<meta name="twitter:card" content="summary" />
			</head>
			<Provider>
				<body className="min-h-screen bg-gray-50 flex justify-center p-2">
					<div className="flex flex-col p-2 max-w-11/12 w-full grow">
						<div className="flex gap-2 w-auto ">
							<NavigationTab />
						</div>
						<div className="pt-2 grow">{children}</div>
						<div className="mt-10">
							<Alert variant="default">
								<Terminal />
								<AlertTitle> 2025年07月現在このサイトはβ版です。</AlertTitle>
								<AlertDescription>
									告知なしの仕様変更、保存データの削除が行われる可能性があります。
									<ul>
										<li>
											<Link
												href="https://github.com/k4a-l/moe-equipment-simulator/issues"
												target="_blank"
												rel="noopener noreferrer"
												className="underline hover:text-blue-600"
											>
												バグ報告、要望などはこちらから
											</Link>
										</li>
										<li>
											<Link
												href="https://github.com/k4a-l/moe-equipment-assets/issues/1"
												target="_blank"
												rel="noopener noreferrer"
												className="underline hover:text-blue-600"
											>
												バフ情報入力の協力募集中
											</Link>
										</li>
									</ul>
								</AlertDescription>
							</Alert>
						</div>
					</div>
				</body>
			</Provider>
		</html>
	);
}
