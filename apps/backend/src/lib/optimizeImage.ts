import sharp from "sharp";

type OptImage = {
	imageBuffer: Buffer | ArrayBuffer;
	options: {
		resize?: {
			width: number;
			height: number;
			fit?: keyof sharp.FitEnum;
			position?: keyof sharp.Gravity;
		};
		crop?: keyof sharp.Gravity & { left: number; top: number };
		rotate?: number;
		flip?: boolean;
		flop?: boolean;
		format?: keyof sharp.FormatEnum;
		quality?: number;
	};
};

export const optImage = async ({ imageBuffer, options }: OptImage) => {
	const processImage = sharp(imageBuffer);
	if (options.resize) {
		processImage.resize(options.resize.width, options.resize.height, {
			fit: options.resize.fit || "cover",
			position: options.resize.position || "center",
		});
	}
	if (options.crop) {
		processImage.extract({
			left: options.crop.left || 0,
			top: options.crop.top || 0,
			width: options.resize?.width || 500,
			height: options.resize?.height || 500,
		});
	}
	if (options.rotate) {
		processImage.rotate(options.rotate);
	}

	if (options.flip) {
		processImage.flip();
	}

	if (options.flop) {
		processImage.flop();
	}

	if (options.format) {
		const formatOptions: Record<
			string,
			| sharp.JpegOptions
			| sharp.PngOptions
			| sharp.WebpOptions
			| sharp.AvifOptions
		> = {
			jpeg: { quality: options.quality || 80 },
			webp: { quality: options.quality || 80 },
			png: { compressionLevel: 9 },
			avif: { quality: options.quality || 50 },
		};
		processImage.toFormat(options.format, formatOptions[options.format]);
	}

	return processImage.toBuffer();
};
