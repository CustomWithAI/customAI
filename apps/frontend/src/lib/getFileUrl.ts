import axios from "axios";
import {
	FileArchive,
	FileCode,
	File as FileIcon,
	FileSpreadsheet,
	FileText,
	FileType,
	Image as ImageIcon,
} from "lucide-react";

type FileMeta = {
	name: string;
	extension: string;
	icon: React.ElementType;
	size: number | null;
};

const extensionToIconMap: Record<string, React.ElementType> = {
	pdf: FileText,
	txt: FileText,
	doc: FileText,
	docx: FileText,
	xls: FileSpreadsheet,
	xlsx: FileSpreadsheet,
	ppt: FileType,
	pptx: FileType,
	png: ImageIcon,
	jpg: ImageIcon,
	jpeg: ImageIcon,
	gif: ImageIcon,
	zip: FileArchive,
	rar: FileArchive,
	tar: FileArchive,
	gz: FileArchive,
	js: FileCode,
	ts: FileCode,
	jsx: FileCode,
	tsx: FileCode,
	default: FileIcon,
};

export const getFileMeta = async (
	url: string | undefined,
): Promise<FileMeta | undefined> => {
	if (!url) return;
	const urlObj = new URL(url);
	const path = urlObj.pathname;
	const name = path.substring(path.lastIndexOf("/") + 1);
	const extension = name.includes(".")
		? name.split(".").pop()?.toLowerCase() || ""
		: "";
	const icon = extensionToIconMap[extension] ?? extensionToIconMap.default;

	let size: number | null = null;

	try {
		const headRes = await axios.head(url, { maxRedirects: 5 });
		const contentLength = headRes.headers["content-length"];
		if (contentLength) {
			size = Number.parseInt(contentLength, 10);
		}
	} catch {}

	if (size == null) {
		try {
			const getRes = await axios.get(url, {
				responseType: "arraybuffer",
				maxRedirects: 5,
			});
			size = getRes.data.byteLength;
		} catch {
			size = null;
		}
	}

	return { name, extension, icon, size };
};
