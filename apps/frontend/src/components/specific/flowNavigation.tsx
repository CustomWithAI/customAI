"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlowNavigation, useIsSubFlow } from "@/hooks/use-flow-navigation";
import { usePathname } from "@/libs/i18nNavigation";
import { ArrowLeft, X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface FlowNavigatorProps {
	title: string;
	collectParams?: boolean;
	showButtons?: boolean;
	customReturnPath?: string;
}

export function FlowNavigator({
	title,
	collectParams = true,
	showButtons = true,
	customReturnPath,
}: FlowNavigatorProps) {
	const params = useParams();
	const searchParams = useSearchParams();
	const { storeFlowData, returnToOrigin, flowOrigin, flowConfig } =
		useFlowNavigation();
	const isSubFlow = useIsSubFlow();

	const hasCollectedRef = useRef(false);

	useEffect(() => {
		if (!collectParams || !isSubFlow) return;

		if (params) {
			storeFlowData(params);
			hasCollectedRef.current = true;
		}

		if (searchParams) {
			const paramsData: Record<string, string> = {};
			let hasParams = false;

			searchParams.forEach((value, key) => {
				paramsData[key] = value;
				hasParams = true;
			});

			if (hasParams && !hasCollectedRef.current) {
				storeFlowData(paramsData);
				hasCollectedRef.current = true;
			}
		}
	}, [collectParams, searchParams, storeFlowData, params, isSubFlow]);

	const handleReturn = () => {
		if (customReturnPath) {
			window.location.href = customReturnPath;
			return;
		}
		returnToOrigin();
	};

	const hasOrigin = !!flowOrigin;
	const originTitle = flowConfig.flowTitle || "Main Flow";

	if (!isSubFlow) return null;

	return (
		<Card className="fixed top-4 right-4 w-64 shadow-md z-50 gap-2 py-4">
			<CardHeader className="py-2">
				<CardTitle className="text-sm font-medium">
					{hasOrigin ? (
						<>
							<span className="text-muted-foreground">{originTitle} → </span>
							{title}
						</>
					) : (
						title
					)}
				</CardTitle>
			</CardHeader>
			{showButtons && (
				<CardContent className="py-2 flex justify-between">
					<Button
						variant="outline"
						size="sm"
						onClick={handleReturn}
						className="flex items-center gap-1"
					>
						{hasOrigin ? (
							<>
								<ArrowLeft className="h-4 w-4" />
								Return
							</>
						) : (
							<>
								<X className="h-4 w-4" />
								Close
							</>
						)}
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
