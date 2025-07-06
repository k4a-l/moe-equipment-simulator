"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigationTabs = [
	{ href: "/search", label: "検索" },
	{ href: "/equ-sim", label: "構成" },
];

export const NavigationTab = () => {
	const pathname = usePathname();

	return (
		<div className="flex p-2 bg-gray-200 gap-2 rounded-md">
			{navigationTabs.map((tab) => (
				<Button
					key={tab.href}
					asChild
					variant={pathname === tab.href ? "outline" : "link"}
					className="shadow-none"
				>
					<Link href={tab.href}>{tab.label}</Link>
				</Button>
			))}
		</div>
	);
};
