import UploadZone from "@/components/specific/upload";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CanvasElement } from "@/features/canvas/useModel/canvasGrid";
import { ImageComponents } from "@/features/canvas/useModel/component/image";
import type { ReactNode } from "react";

export const elementContent: Record<
	string,
	{
		width: number;
		height: number;
		component: (element: CanvasElement) => ReactNode;
	}
> = {
	image: {
		width: 1000,
		height: 500,
		component: (element: CanvasElement) => (
			<ImageComponents element={element} />
		),
	},
};
