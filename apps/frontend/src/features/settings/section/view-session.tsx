"use client";
import { Content, Subtle } from "@/components/typography/text";
import {
	useActivitySessions,
	useRetrieveSession,
} from "@/hooks/queries/security-api";
import { authClient } from "@/libs/auth-client";
import { getDeviceFromUserAgent } from "@/utils/userAgentFormat";
import type { User } from "better-auth/types";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import {
	type ReactElement,
	type ReactNode,
	cloneElement,
	useMemo,
} from "react";

type Session = {
	token: string;
} & User;

const icon: Record<string, ReactNode> = {
	Macintosh: <Monitor />,
	Windows: <Monitor />,
	iPhone: <Smartphone />,
	iPad: <Tablet />,
	Android: <Smartphone />,
	Linux: <Monitor />,
};
export const ViewSessionSection = () => {
	const { data, isPending } = useActivitySessions();
	const { data: session } = authClient.useSession();

	const sessionActivity = useMemo(() => {
		return data?.data?.map((user) => {
			const currentSession =
				(user as unknown as Session).token ===
				(session?.session as unknown as Session).token;
			return {
				current: currentSession,
				token: (user as unknown as Session).token,
				expireAt: user.expiresAt,
				ipAddress: user.ipAddress,
				device: user?.userAgent
					? getDeviceFromUserAgent(user.userAgent)
					: "unknown",
			};
		});
	}, [data, session]);

	return (
		<>
			{sessionActivity?.map((item) => (
				<div className="flex" key={item.token}>
					{cloneElement(icon[item.device] as ReactElement, {
						className: "w-10 h-10",
					})}
					<div className="ml-3">
						<Content>{item.current ? "Current Session" : item.token}</Content>
						<Subtle>{item.ipAddress || "unknown ip"}</Subtle>
					</div>
				</div>
			))}
		</>
	);
};
