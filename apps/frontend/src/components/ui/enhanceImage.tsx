"use client";
import cv from "@techstark/opencv-js";
import deepEqual from "fast-deep-equal";
import { CloudAlert, LoaderCircle, Settings } from "lucide-react";
import type React from "react";
import { memo, useEffect, useRef, useState } from "react";
import { cn } from "../../libs/utils";

interface FilterStyle {
	type: "style";
	value: string;
}

interface FilterCrop {
	type: "crop";
	params: [number, number, number, number];
}

interface FilterResizing {
	type: "resizing";
	params: [number, number];
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
	params?: [number];
}

interface FilterErosion {
	type: "erosion";
	params?: [number];
}

interface FilterAdaptiveEqualization {
	type: "adaptive_equalization";
	params?: [number];
}

interface FilterOpening {
	type: "opening";
	params?: [number];
}

interface FilterClosing {
	type: "closing";
	params?: [number];
}

interface FilterTranslate {
	type: "translate";
	params: [number, number];
}

interface FilterScale {
	type: "scale";
	params?: [number, number];
}

interface FilterBrightness {
	type: "brightness";
	params?: [number];
}

interface FilterContrastStretching {
	type: "contrast_stretching";
	params?: [number, number];
}

interface FilterHue {
	type: "hue";
	params?: [number];
}

interface FilterSaturation {
	type: "saturation";
	params?: [number];
}

interface FilterGamma {
	type: "gamma";
	params?: [number];
}

interface FilterZoomBlur {
	type: "zoom_blur";
	params?: [number];
}

interface FilterMotionBlur {
	type: "motion_blur";
	params?: [number, number];
}

interface FilterGaussianNoise {
	type: "gaussian_noise";
	params?: [number, number]; // [mean, variance]
}

interface FilterSaltPepperNoise {
	type: "salt_pepper_noise";
	params?: [number, number]; // [amount, salt-vs-pepper ratio]
}

interface FilterRandomErasing {
	type: "random_erasing";
	params?: [number, number, number, number]; // [x, y, width, height]
}

interface FilterElasticDistortion {
	type: "elastic_distortion";
	params?: [number, number]; // [alpha, sigma]
}

interface FilterHOG {
	type: "hog";
	params?: [number[], number[], number];
}

interface FilterORB {
	type: "orb";
	params?: [number, number, number];
}

interface FilterSIFT {
	type: "sift";
	params?: [number, number, number];
}

interface FilterOpenCV<T extends keyof typeof import("@techstark/opencv-js")> {
	type: "opencv";
	method: T;
	params: Parameters<typeof import("@techstark/opencv-js")[T]>;
}

export type Filter =
	| FilterStyle
	| FilterOpenCV<keyof typeof import("@techstark/opencv-js")>
	| FilterCrop
	| FilterResizing
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
	| FilterClosing
	| FilterTranslate
	| FilterScale
	| FilterBrightness
	| FilterContrastStretching
	| FilterHue
	| FilterGamma
	| FilterSaturation
	| FilterAdaptiveEqualization
	| FilterZoomBlur
	| FilterMotionBlur
	| FilterGaussianNoise
	| FilterSaltPepperNoise
	| FilterRandomErasing
	| FilterElasticDistortion
	| FilterHOG
	| FilterORB
	| FilterSIFT;

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
		const [isError, setIsError] = useState<boolean>(false);

		useEffect(() => {
			try {
				if (
					typeof cv.getBuildInformation === "function" &&
					cv.getBuildInformation()
				) {
					setIsOpenCVReady(true);
				} else {
					cv.onRuntimeInitialized = () => {
						setIsOpenCVReady(true);
					};
				}
			} catch (error) {
				console.error(error);
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

				try {
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

							case "resizing": {
								const [width, height] = filter.params as [number, number];
								const dst = new cv.Mat();
								const dsize = new cv.Size(width, height);
								cv.resize(mat, dst, dsize, 0, 0, cv.INTER_LINEAR);
								mat.delete();
								mat = dst;
								break;
							}

							case "perspective": {
								if (
									filter.srcPoints.length !== 4 ||
									filter.dstPoints.length !== 4
								) {
									console.error(
										"Perspective transformation requires 4 points.",
									);
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
								cv.warpPerspective(
									mat,
									dst,
									M,
									new cv.Size(mat.cols, mat.rows),
								);
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
									(
										cv[
											filter.method as keyof typeof import("@techstark/opencv-js")
										] as any
									)(mat, mat, ...filter.params);
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
									cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);
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

								const minVal = new cv.MinMaxLoc();
								const maxVal = new cv.MinMaxLoc();
								cv.minMaxLoc(dst, minVal, maxVal);

								const ones = new cv.Mat(
									dst.rows,
									dst.cols,
									dst.type(),
									new cv.Scalar(1.0),
								);
								cv.add(dst, ones, dst);
								ones.delete();

								cv.log(dst, dst);

								cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);

								const result = new cv.Mat();
								dst.convertTo(result, cv.CV_8U);

								mat.delete();
								dst.delete();
								mat = result;
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
								const kernelSize = 3;
								const kernel = cv.Mat.ones(kernelSize, kernelSize, cv.CV_8U);

								const dst = new cv.Mat();
								cv.erode(mat, dst, kernel);

								mat.delete();
								kernel.delete();
								mat = dst;
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

							case "translate": {
								const [dx, dy] = filter.params as [number, number];
								const dst = new cv.Mat();

								const M = cv.matFromArray(2, 3, cv.CV_32F, [
									1,
									0,
									dx,
									0,
									1,
									dy,
								]); // Transformation matrix
								cv.warpAffine(mat, dst, M, new cv.Size(mat.cols, mat.rows));

								mat.delete();
								M.delete();
								mat = dst;
								break;
							}

							case "scale": {
								const [sx, sy] = filter.params as [number, number];
								const originalSize = new cv.Size(mat.cols, mat.rows);
								const scaledSize = new cv.Size(mat.cols * sx, mat.rows * sy);

								const dst = new cv.Mat();
								const resized = new cv.Mat();

								cv.resize(mat, resized, scaledSize, 0, 0, cv.INTER_LINEAR);

								dst.create(originalSize.height, originalSize.width, mat.type());
								dst.setTo(new cv.Scalar(0, 0, 0, 255));

								const xOffset = Math.max(
									0,
									Math.floor((originalSize.width - resized.cols) / 2),
								);
								const yOffset = Math.max(
									0,
									Math.floor((originalSize.height - resized.rows) / 2),
								);

								const roi = dst.roi(
									new cv.Rect(xOffset, yOffset, resized.cols, resized.rows),
								);
								resized.copyTo(roi);

								mat.delete();
								resized.delete();
								mat = dst;
								break;
							}

							case "contrast_stretching": {
								const [low, high] = filter.params as [number, number];
								const dst = new cv.Mat();

								cv.normalize(mat, dst, low * 255, high * 255, cv.NORM_MINMAX);

								mat.delete();
								mat = dst;
								break;
							}

							case "adaptive_equalization": {
								const params = filter.params as [number] | undefined;
								if (!params) break;

								const clipLimit = params[0];
								const tileGridSize = 8;

								const lab = new cv.Mat();
								cv.cvtColor(mat, lab, cv.COLOR_BGR2Lab);

								const channels = new cv.MatVector();
								cv.split(lab, channels);

								const clahe = new cv.CLAHE(
									clipLimit,
									new cv.Size(tileGridSize, tileGridSize),
								);
								const equalizedL = new cv.Mat();
								clahe.apply(channels.get(0), equalizedL);

								equalizedL.copyTo(channels.get(0));
								cv.merge(channels, lab);
								cv.cvtColor(lab, mat, cv.COLOR_Lab2BGR);

								lab.delete();
								channels.delete();
								clahe.delete();
								equalizedL.delete();
								break;
							}

							case "hue": {
								const params = filter.params as [number] | undefined;
								if (!params) break;

								const hueShift = params[0];

								const hsv = new cv.Mat();
								cv.cvtColor(mat, hsv, cv.COLOR_BGR2HSV);

								const channels = new cv.MatVector();
								cv.split(hsv, channels);

								channels.get(0).convertTo(channels.get(0), -1, 1, hueShift);

								cv.merge(channels, hsv);
								cv.cvtColor(hsv, mat, cv.COLOR_HSV2BGR);

								hsv.delete();
								channels.delete();
								break;
							}

							case "gamma": {
								const params = filter.params as [number] | undefined;
								if (!params) break;

								const gamma = params[0];
								if (gamma <= 0) break;

								const lookupTable = new cv.Mat(1, 256, cv.CV_8U);
								for (let i = 0; i < 256; i++) {
									lookupTable.data[i] = Math.min(
										255,
										(i / 255) ** (1 / gamma) * 255,
									);
								}

								cv.LUT(mat, lookupTable, mat);

								lookupTable.delete();
								break;
							}

							case "saturation": {
								const params = filter.params as [number] | undefined;
								if (!params) break;

								const saturationScale = params[0];

								const hsv = new cv.Mat();
								cv.cvtColor(mat, hsv, cv.COLOR_BGR2HSV);

								const channels = new cv.MatVector();
								cv.split(hsv, channels);

								channels
									.get(1)
									.convertTo(channels.get(1), -1, saturationScale, 0);

								cv.merge(channels, hsv);
								cv.cvtColor(hsv, mat, cv.COLOR_HSV2BGR);

								hsv.delete();
								channels.delete();
								break;
							}

							case "zoom_blur": {
								const params = filter.params as [number] | undefined;
								if (!params) break;

								const intensity = params[0];
								const center = new cv.Point(mat.cols / 2, mat.rows / 2);

								const dst = cv.Mat.zeros(mat.rows, mat.cols, mat.type());
								const alphaStep = 1.0 / intensity;

								for (let i = 0; i < intensity; i++) {
									const scale = 1 + (i / intensity) * 0.2;
									const temp = new cv.Mat();
									cv.resize(
										mat,
										temp,
										new cv.Size(0, 0),
										scale,
										scale,
										cv.INTER_LINEAR,
									);

									const roi = new cv.Rect(
										Math.floor((temp.cols - mat.cols) / 2),
										Math.floor((temp.rows - mat.rows) / 2),
										mat.cols,
										mat.rows,
									);

									const cropped = temp.roi(roi);
									cv.addWeighted(
										dst,
										1 - alphaStep,
										cropped,
										alphaStep,
										0,
										dst,
									);

									temp.delete();
									cropped.delete();
								}

								mat.delete();
								mat = dst;
								break;
							}

							case "motion_blur": {
								const params = filter.params as [number, number] | undefined;
								if (!params) break;

								const [kernelSize, angle] = params;
								const k = Math.max(3, kernelSize | 1);

								const kernel = cv.Mat.zeros(k, k, cv.CV_32F);
								const center = Math.floor(k / 2);

								for (let i = 0; i < k; i++) {
									const x = center + Math.cos(angle) * (i - center);
									const y = center + Math.sin(angle) * (i - center);
									kernel.floatPtr(y, x)[0] = 1.0 / k;
								}

								const dst = new cv.Mat();
								cv.filter2D(mat, dst, -1, kernel);

								mat.delete();
								mat = dst;
								kernel.delete();
								break;
							}

							case "gaussian_noise": {
								const params = filter.params as [number, number];
								if (!params) break;

								const [mean, variance] = params;
								const dst = new cv.Mat();
								const noise = new cv.Mat(mat.rows, mat.cols, mat.type());

								const meanMat = new cv.Mat(
									1,
									1,
									cv.CV_32F,
									new Float32Array([mean]),
								);
								const stddevMat = new cv.Mat(
									1,
									1,
									cv.CV_32F,
									new Float32Array([Math.sqrt(variance)]),
								);

								cv.randn(noise, meanMat, stddevMat);

								cv.add(mat, noise, dst);

								mat.delete();
								mat = dst;
								noise.delete();
								break;
							}

							case "salt_pepper_noise": {
								const params = filter.params as [number, number];
								if (!params) break;

								const [amount, saltVsPepperRatio] = params;
								const dst = new cv.Mat();
								const noise = new cv.Mat(mat.rows, mat.cols, mat.type());

								const low = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(0),
								);
								const high = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(1),
								);

								cv.randu(noise, low, high);

								const saltThreshold = amount * saltVsPepperRatio;
								const pepperThreshold = amount * (1 - saltVsPepperRatio);

								const saltMask = new cv.Mat();
								const pepperMask = new cv.Mat();

								const saltLowerb = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(saltThreshold),
								);
								const saltUpperb = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(1),
								);
								const pepperLowerb = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(0),
								);
								const pepperUpperb = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(pepperThreshold),
								);

								// Apply the inRange function with cv.Mat
								cv.inRange(noise, saltLowerb, saltUpperb, saltMask);
								cv.inRange(noise, pepperLowerb, pepperUpperb, pepperMask);

								cv.bitwise_and(mat, mat, dst, saltMask);
								dst.setTo(new cv.Scalar(255, 255, 255), saltMask);

								cv.bitwise_and(mat, mat, dst, pepperMask);
								dst.setTo(new cv.Scalar(0, 0, 0), pepperMask);

								mat.delete();
								mat = dst;
								noise.delete();
								low.delete();
								high.delete();
								saltLowerb.delete();
								saltUpperb.delete();
								pepperLowerb.delete();
								pepperUpperb.delete();
								saltMask.delete();
								pepperMask.delete();
								break;
							}

							case "random_erasing": {
								const params = filter.params as [
									number,
									number,
									number,
									number,
								];
								if (!params) break;

								const [x, y, width, height] = params;

								const dst = new cv.Mat();
								mat
									.roi(new cv.Rect(x, y, width, height))
									.setTo(new cv.Scalar(0, 0, 0));

								break;
							}

							case "elastic_distortion": {
								const params = filter.params as [number, number];
								if (!params) break;

								const [alpha, sigma] = params;
								const dst = new cv.Mat();
								const displacementX = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
								);
								const displacementY = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
								);

								const mean = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(0),
								);
								const stddev = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
									new cv.Scalar(sigma),
								);

								cv.randn(displacementX, mean, stddev);
								cv.randn(displacementY, mean, stddev);

								const elasticDistortion = new cv.Mat(
									mat.rows,
									mat.cols,
									mat.type(),
								);
								for (let i = 0; i < mat.rows; i++) {
									for (let j = 0; j < mat.cols; j++) {
										const x = i + displacementX.ucharAt(i, j);
										const y = j + displacementY.ucharAt(i, j);

										const newX = Math.min(mat.rows - 1, Math.max(0, x));
										const newY = Math.min(mat.cols - 1, Math.max(0, y));

										elasticDistortion.ucharAt(i, j, mat.ucharAt(newX, newY));
									}
								}

								mat.delete();
								mat = elasticDistortion;

								displacementX.delete();
								displacementY.delete();
								mean.delete();
								stddev.delete();
								elasticDistortion.delete();
								break;
							}

							case "hog": {
								const [pixels_per_cell, cells_per_block, orientations] =
									filter.params as [number[], number[], number];

								const gradX = new cv.Mat();
								const gradY = new cv.Mat();
								cv.Sobel(
									mat,
									gradX,
									cv.CV_32F,
									1,
									0,
									3,
									1,
									0,
									cv.BORDER_DEFAULT,
								);
								cv.Sobel(
									mat,
									gradY,
									cv.CV_32F,
									0,
									1,
									3,
									1,
									0,
									cv.BORDER_DEFAULT,
								);

								const magnitude = new cv.Mat();
								const angle = new cv.Mat();
								cv.cartToPolar(gradX, gradY, magnitude, angle, true);

								const cellSize = pixels_per_cell;
								const blockSize = cells_per_block;

								const histograms: cv.Mat[] = [];

								for (let y = 0; y < mat.rows - cellSize[1]; y += cellSize[1]) {
									for (
										let x = 0;
										x < mat.cols - cellSize[0];
										x += cellSize[0]
									) {
										const cellMagnitude = magnitude.roi(
											new cv.Rect(x, y, cellSize[0], cellSize[1]),
										);
										const cellAngle = angle.roi(
											new cv.Rect(x, y, cellSize[0], cellSize[1]),
										);

										const hist = new cv.Mat();
										const range = [0, 180];

										const matVector = new cv.MatVector();
										matVector.push_back(cellAngle);

										cv.calcHist(
											matVector,
											[0],
											new cv.Mat(),
											hist,
											[orientations],
											range,
										);

										histograms.push(hist);

										cellMagnitude.delete();
										cellAngle.delete();
									}
								}

								const histVector = new cv.MatVector();
								for (const hist of histograms) {
									histVector.push_back(hist);
								}

								const mask = new cv.Mat();
								const histSize = [orientations];
								const ranges = [0, 180];
								const histResult = new cv.Mat();

								const matVector = new cv.MatVector();
								matVector.push_back(mat);

								cv.calcHist(matVector, [0], mask, histResult, histSize, ranges);

								console.log(histResult);

								gradX.delete();
								gradY.delete();
								magnitude.delete();
								angle.delete();

								break;
							}

							case "orb": {
								const [n_keypoints, scale_factor, n_level] = filter.params as [
									number,
									number,
									number,
								];

								const gray = new cv.Mat();
								if (mat.channels() > 1) {
									cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
								} else {
									mat.copyTo(gray);
								}

								const orb = new cv.ORB(n_keypoints, scale_factor, n_level);
								const keypoints = new cv.KeyPointVector();
								const descriptors = new cv.Mat();

								orb.detectAndCompute(
									gray,
									new cv.Mat(),
									keypoints,
									descriptors,
								);

								const imgWithKeypoints = new cv.Mat();
								const color = new cv.Scalar(0, 255, 0, 255);
								const flags = cv.DRAW_RICH_KEYPOINTS;
								cv.drawKeypoints(
									mat,
									keypoints,
									imgWithKeypoints,
									color,
									flags,
								);

								mat.delete();
								gray.delete();
								descriptors.delete();
								mat = imgWithKeypoints;

								orb.delete();
								break;
							}
							case "sift": {
								const [n_keypoints, contrast_threshold, edge_threshold] =
									filter.params as [number, number, number];

								const gray = new cv.Mat();
								if (mat.channels() > 1) {
									cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
								} else {
									mat.copyTo(gray);
								}

								const keypoints = new cv.KeyPointVector();
								const descriptors = new cv.Mat();

								try {
									if ((cv as any).SIFT) {
										const sift = new (cv as any).SIFT(
											n_keypoints,
											3,
											contrast_threshold,
											edge_threshold,
											1.6,
										);
										sift.detectAndCompute(
											gray,
											new cv.Mat(),
											keypoints,
											descriptors,
										);
									} else {
										const orb = new cv.ORB(n_keypoints, 1.2, 8);
										orb.detectAndCompute(
											gray,
											new cv.Mat(),
											keypoints,
											descriptors,
										);
									}
								} catch (error) {
									console.warn(
										"SIFT not available, falling back to ORB",
										error,
									);
									const orb = new cv.ORB(n_keypoints, 1.2, 8);
									orb.detectAndCompute(
										gray,
										new cv.Mat(),
										keypoints,
										descriptors,
									);
								}

								const imgWithKeypoints = new cv.Mat();
								const color = new cv.Scalar(0, 255, 0, 255);
								const flags = cv.DRAW_RICH_KEYPOINTS;
								cv.drawKeypoints(
									mat,
									keypoints,
									imgWithKeypoints,
									color,
									flags,
								);

								mat.delete();
								gray.delete();
								descriptors.delete();
								mat = imgWithKeypoints;
								break;
							}
						}
					}
				} catch (error) {
					console.warn(error);
				}

				cv.imshow(canvas, mat);
				mat.delete();

				setProcessedImage(canvas.toDataURL());
				setIsError(false);
			};

			img.onerror = () => {
				setIsError(true);
				console.error("Failed to load image:", imagePath);
			};
		}, [imagePath, filters, isOpenCVReady]);

		return (
			<div>
				<canvas ref={canvasRef} className="hidden" />
				{isError ? (
					<div className="flex items-center justify-center bg-zinc-200 aspect-video h-full">
						<CloudAlert />
					</div>
				) : processedImage ? (
					<img
						ref={imgRef}
						src={processedImage}
						alt="Processed"
						loading="lazy"
						className={className}
					/>
				) : (
					<>
						{isOpenCVReady ? (
							<div
								className={cn(
									"flex items-center justify-center bg-zinc-200 aspect-video h-full",
									className,
								)}
							>
								<LoaderCircle className="animate-spin" />
							</div>
						) : (
							<div
								className={cn(
									"flex items-center justify-center bg-zinc-200 aspect-video h-full",
									className,
								)}
							>
								<Settings className="animate-spin" />
							</div>
						)}
					</>
				)}
			</div>
		);
	},
);

export default EnhanceImage;
