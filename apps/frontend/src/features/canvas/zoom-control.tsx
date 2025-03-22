"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface ZoomControlsProps {
	zoom: number;
	onZoomChange: (zoom: number) => void;
	onZoomToFit: () => void;
	width: number;
	height: number;
	setOpen: (isSetOpen: boolean) => void;
	open: boolean;
}

const ZOOM_LEVELS = [0.25, 0.5, 1, 2, 4];
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const logarithmicToLinear = (zoom: number): number => {
	return (
		((Math.log(zoom) - Math.log(MIN_ZOOM)) /
			(Math.log(MAX_ZOOM) - Math.log(MIN_ZOOM))) *
		100
	);
};

export function ZoomControls({
	zoom,
	onZoomChange,
	onZoomToFit,
	open,
	setOpen,
	width,
	height,
}: ZoomControlsProps) {
	const [sliderValue, setSliderValue] = useState<number[]>([
		logarithmicToLinear(zoom),
	]);

	function linearToLogarithmic(value: number): number {
		return Math.exp(
			Math.log(MIN_ZOOM) +
				(value / 100) * (Math.log(MAX_ZOOM) - Math.log(MIN_ZOOM)),
		);
	}

	useEffect(() => {
		setSliderValue([logarithmicToLinear(zoom)]);
	}, [zoom]);

	const handleSliderChange = (value: number[]) => {
		setSliderValue(value);
		const newZoom = linearToLogarithmic(value[0]);
		onZoomChange(Number.parseFloat(newZoom.toFixed(2)));
	};

	const zoomIn = () => {
		const currentIndex = ZOOM_LEVELS.indexOf(zoom);
		if (currentIndex < ZOOM_LEVELS.length - 1 && currentIndex !== -1) {
			onZoomChange(ZOOM_LEVELS[currentIndex + 1]);
		} else if (zoom < MAX_ZOOM) {
			onZoomChange(
				Math.min(MAX_ZOOM, Number.parseFloat((zoom + ZOOM_STEP).toFixed(2))),
			);
		}
	};

	const zoomOut = () => {
		const currentIndex = ZOOM_LEVELS.indexOf(zoom);
		if (currentIndex > 0) {
			onZoomChange(ZOOM_LEVELS[currentIndex - 1]);
		} else if (zoom > MIN_ZOOM) {
			onZoomChange(
				Math.max(MIN_ZOOM, Number.parseFloat((zoom - ZOOM_STEP).toFixed(2))),
			);
		}
	};

	return (
		<>
			{open && (
				<>
					<div className="p-4 flex flex-col border-b border-gray-200">
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold">Zoom</h3>
						</div>
					</div>
					<div className="p-4 w-full space-y-3">
						<div className="flex items-center gap-2 w-full max-w-[350px]">
							<div className="flex items-center gap-2 flex-1">
								<ZoomOut className="h-3 w-3 text-gray-500 shrink-0" />
								<Slider
									value={sliderValue}
									min={0}
									max={100}
									step={1}
									onValueChange={handleSliderChange}
									className="flex-1"
								/>
								<ZoomIn className="h-4 w-4 text-gray-500 shrink-0" />
							</div>

							<div className="min-w-[60px] text-center text-sm">
								{Math.round(zoom * 100)}%
							</div>
						</div>
						<div className="w-full">
							<Button
								variant="outline"
								onClick={zoomIn}
								disabled={zoom >= MAX_ZOOM}
							>
								<ZoomIn className="h-4 w-4" /> Zoom in
							</Button>
						</div>
						<div className="w-full">
							<Button
								variant="outline"
								onClick={zoomOut}
								disabled={zoom <= MIN_ZOOM}
							>
								<ZoomOut className="h-4 w-4" /> Zoom out
							</Button>
						</div>
						<div className="w-full">
							<Button
								variant="outline"
								onClick={onZoomToFit}
								title="Zoom to Fit"
							>
								<Maximize className="h-4 w-4" /> Zoom on fit
							</Button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
