"use client";
import cv from "@techstark/opencv-js";
import type React from "react";
import { memo, useEffect, useRef, useState } from "react";

interface FilterStyle {
	type: "style";
	value: string;
}

interface FilterCrop {
	type: "crop";
	params: [number, number, number, number];
}

interface FilterRotation {
	type: "rotate";
	angle: number;
}

interface FilterGrayscale {
	type: "grayscale";
}

interface FilterPerspective {
	type: "perspective";
	srcPoints: [number, number][];
	dstPoints: [number, number][];
}

interface FilterThreshold {
	type: "threshold";
	threshold: number;
	maxValue: number;
	thresholdType?: number;
}

interface FilterMeanBlur {
	type: "meanBlur";
	params: [number, number]; // Kernel size (width, height)
}

interface FilterMedianBlur {
	type: "medianBlur";
	params: [number]; // Kernel size (must be odd)
}

interface FilterNormalize {
	type: "normalize";
	params: [number, number, number, number]; // alpha, beta, normType, dtype
}

interface FilterLogTransform {
	type: "logTransform";
}

interface FilterHistEqualization {
	type: "histEqualization";
}

interface FilterSharpen {
	type: "sharpen";
}

interface FilterLaplacian {
	type: "laplacian";
	params?: [number, number]; // Kernel size (default: [3])
}

interface FilterGaussianBlur {
	type: "gaussianBlur";
	params?: [[number, number], number]; // [kernelSize, sigma] (default: [[5, 5], 1.0])
}

interface FilterSharpen {
	type: "sharpen";
	params?: [number]; // Strength (default 1)
}

interface FilterUnsharpMasking {
	type: "unsharpMasking";
	params?: [number, number]; // [kernelSize, intensity] (default [5, 1])
}

interface FilterDilation {
	type: "dilation";
	params?: [number]; // Kernel size (default: [3])
}

interface FilterErosion {
	type: "erosion";
	params?: [number]; // Kernel size (default: [3])
}

interface FilterOpening {
	type: "opening";
	params?: [number]; // Kernel size (default: [3])
}

interface FilterClosing {
	type: "closing";
	params?: [number]; // Kernel size (default: [3])
}

interface FilterOpenCV<T extends keyof typeof cv> {
	type: "opencv";
	method: T;
	params: Parameters<(typeof cv)[T]>;
}

export type Filter =
	| FilterStyle
	| FilterOpenCV<keyof typeof cv>
	| FilterCrop
	| FilterRotation
	| FilterPerspective
	| FilterGrayscale
	| FilterThreshold
	| FilterMeanBlur
	| FilterMedianBlur
	| FilterNormalize
	| FilterLogTransform
	| FilterHistEqualization
	| FilterSharpen
	| FilterSharpen
	| FilterUnsharpMasking
	| FilterLaplacian
	| FilterGaussianBlur
	| FilterDilation
	| FilterErosion
	| FilterOpening
	| FilterClosing;

interface EnhanceImageProps {
	imagePath: string;
	filters: Filter[];
	className?: string;
}

const EnhanceImage: React.FC<EnhanceImageProps> = memo(
	({ imagePath, filters, className }) => {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const imgRef = useRef<HTMLImageElement>(null);
		const [processedImage, setProcessedImage] = useState<string>("");
		const [isOpenCVReady, setIsOpenCVReady] = useState<boolean>(false);

		useEffect(() => {
			if (cv.getBuildInformation()) {
				setIsOpenCVReady(true);
			} else {
				cv.onRuntimeInitialized = () => {
					setIsOpenCVReady(true);
				};
			}
		}, []);

		useEffect(() => {
			if (!isOpenCVReady) return;

			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = imagePath;

			img.onload = () => {
				if (!canvasRef.current) return;
				const canvas = canvasRef.current;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				let mat = cv.imread(canvas);

				for (const filter of filters) {
					switch (filter.type) {
						case "style":
							if (imgRef.current) imgRef.current.style.filter = filter.value;
							break;

						case "crop": {
							const [x, y, width, height] = filter.params;
							const rect = new cv.Rect(
								Number(x),
								Number(y),
								Number(width),
								Number(height),
							);
							mat = mat.roi(rect);
							break;
						}

						case "rotate": {
							const center = new cv.Point(mat.cols / 2, mat.rows / 2);
							const M = cv.getRotationMatrix2D(center, filter.angle, 1.0);
							const dst = new cv.Mat();
							cv.warpAffine(mat, dst, M, new cv.Size(mat.cols, mat.rows));
							mat.delete();
							M.delete();
							mat = dst;
							break;
						}

						case "perspective": {
							if (
								filter.srcPoints.length !== 4 ||
								filter.dstPoints.length !== 4
							) {
								console.error("Perspective transformation requires 4 points.");
								break;
							}
							const srcMat = cv.matFromArray(
								4,
								1,
								cv.CV_32FC2,
								filter.srcPoints.flat(),
							);
							const dstMat = cv.matFromArray(
								4,
								1,
								cv.CV_32FC2,
								filter.dstPoints.flat(),
							);
							const M = cv.getPerspectiveTransform(srcMat, dstMat);
							const dst = new cv.Mat();
							cv.warpPerspective(mat, dst, M, new cv.Size(mat.cols, mat.rows));
							mat.delete();
							M.delete();
							srcMat.delete();
							dstMat.delete();
							mat = dst;
							break;
						}

						case "threshold": {
							const dst = new cv.Mat();
							const thresholdValue = (filter.threshold / 100) * 255;
							const thresholdType = filter.thresholdType ?? cv.THRESH_BINARY;
							cv.threshold(
								mat,
								dst,
								thresholdValue,
								filter.maxValue,
								thresholdType,
							);
							mat.delete();
							mat = dst;
							break;
						}

						case "grayscale": {
							const dst = new cv.Mat();
							cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY);
							mat.delete();
							mat = dst;
							break;
						}

						case "opencv":
							try {
								(cv[filter.method] as any)(mat, mat, ...filter.params);
							} catch (err) {
								console.error(
									`Error applying OpenCV filter: ${filter.method}`,
									err,
								);
							}
							break;

						case "meanBlur": {
							const dst = new cv.Mat();
							const [width, height] = filter.params;
							const ksize = new cv.Size(width, height);
							cv.blur(mat, dst, ksize);
							mat.delete();
							mat = dst;
							break;
						}

						case "medianBlur": {
							const dst = new cv.Mat();
							const [ksize] = filter.params;
							cv.medianBlur(mat, dst, ksize);
							mat.delete();
							mat = dst;
							break;
						}

						case "normalize": {
							const dst = new cv.Mat();
							const [alpha, beta, normType, dtype] = filter.params;
							cv.normalize(mat, dst, alpha, beta, normType, dtype);
							mat.delete();
							mat = dst;
							break;
						}

						case "histEqualization": {
							if (mat.channels() > 1) {
								cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY); // Convert to grayscale
							}
							const dst = new cv.Mat();
							cv.equalizeHist(mat, dst);
							mat.delete();
							mat = dst;
							break;
						}

						case "logTransform": {
							const dst = new cv.Mat();
							mat.convertTo(dst, cv.CV_32F);

							cv.add(
								dst,
								new cv.Mat(dst.rows, dst.cols, dst.type(), new cv.Scalar(1)),
								dst,
							);
							cv.log(dst, dst);

							cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);
							dst.convertTo(dst, cv.CV_8U);

							mat.delete();
							mat = dst;
							break;
						}

						case "sharpen": {
							const strength = filter.params?.[0] || 1;
							const kernel = cv.matFromArray(3, 3, cv.CV_32F, [
								0,
								-1,
								0,
								-1,
								5 * strength,
								-1,
								0,
								-1,
								0,
							]);

							const dst = new cv.Mat();
							cv.filter2D(mat, dst, -1, kernel);
							mat.delete();
							kernel.delete();
							mat = dst;
							break;
						}

						case "unsharpMasking": {
							const kernelSize = filter.params?.[0] || 5;
							const intensity = filter.params?.[1] || 1;

							const blurred = new cv.Mat();
							cv.GaussianBlur(
								mat,
								blurred,
								new cv.Size(kernelSize, kernelSize),
								0,
							);

							const mask = new cv.Mat();
							cv.subtract(mat, blurred, mask);

							const dst = new cv.Mat();
							cv.addWeighted(mat, 1 + intensity, mask, intensity, 0, dst);

							// Cleanup
							mat.delete();
							blurred.delete();
							mask.delete();
							mat = dst;
							break;
						}

						case "laplacian": {
							const kernelSize = 3; // Kernel size (3x3 by default)
							const scale = filter.params?.[0] || 1; // Scaling factor (default 1)
							const delta = filter.params?.[1] || 0; // Delta (default 0)

							const dst = new cv.Mat();
							cv.Laplacian(
								mat,
								dst,
								cv.CV_16S,
								kernelSize,
								scale,
								delta,
								cv.BORDER_DEFAULT,
							);

							cv.convertScaleAbs(dst, dst);
							cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);

							mat.delete();
							mat = dst;
							break;
						}

						case "gaussianBlur": {
							const [kernelSize, sigma] = filter.params || [[5, 5], 1.0]; // Default: [5, 5] kernel and sigma = 1.0
							const dst = new cv.Mat();
							cv.GaussianBlur(
								mat,
								dst,
								new cv.Size(kernelSize[0], kernelSize[1]),
								sigma,
							);
							mat.delete();
							mat = dst;
							break;
						}

						case "dilation": {
							const kernelSize = 3;
							const kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U); // Create a 3x3 square kernel

							const dst = new cv.Mat();
							cv.dilate(mat, dst, kernel);

							mat.delete();
							kernel.delete();
							mat = dst;
							break;
						}
						case "erosion": {
							const kernelSize = 3; // 3x3 kernel size for erosion
							const kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U); // Create a 3x3 square kernel

							const dst = new cv.Mat();
							cv.erode(mat, dst, kernel); // Apply erosion with the kernel

							mat.delete();
							kernel.delete();
							mat = dst; // Update mat with processed result
							break;
						}
						case "opening": {
							const kernelSize = 3;
							const kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);

							const dst = new cv.Mat();
							cv.morphologyEx(mat, dst, cv.MORPH_OPEN, kernel);

							mat.delete();
							kernel.delete();
							mat = dst;
							break;
						}
						case "closing": {
							const kernelSize = 3;
							const kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);

							const dst = new cv.Mat();
							cv.morphologyEx(mat, dst, cv.MORPH_CLOSE, kernel);

							mat.delete();
							kernel.delete();
							mat = dst;
							break;
						}
					}
				}

				cv.imshow(canvas, mat);
				mat.delete();

				setProcessedImage(canvas.toDataURL());
			};

			img.onerror = () => console.error("Failed to load image:", imagePath);
		}, [imagePath, filters, isOpenCVReady]);

		return (
			<div>
				<canvas ref={canvasRef} className="hidden" />
				{processedImage ? (
					<img
						ref={imgRef}
						src={processedImage}
						alt="Processed"
						loading="lazy"
						className={className}
					/>
				) : (
					<p>{isOpenCVReady ? "Processing image..." : "Loading OpenCV..."}</p>
				)}
			</div>
		);
	},
);

export default EnhanceImage;
