"use client";
import type { ColumnType } from "@/components/layout/StaticTable";

type ColumnFormat = {
	header?: string;
	type?: ColumnType;
};

type FormatMap = Record<string, ColumnFormat>;

export function parseCsvToTable(
	csv: string,
	delimiter = ",",
	formatMap: FormatMap = {},
) {
	const lines = csv.trim().split(/\r?\n/).filter(Boolean);
	console.log(lines);

	if (lines.length < 1) console.warn("CSV must have at least one row");

	const headers = lines[0].split(delimiter).map((h) => h.trim());

	const columns = headers.map((key) => {
		const format = formatMap[key] || {};
		return {
			accessorKey: key,
			header: format.header ?? key,
			type: format.type,
		};
	});

	const data = lines.slice(1).map((line) => {
		const values = line.split(delimiter).map((v) => v.trim());
		const row: Record<string, string> = {};
		headers.forEach((key, i) => {
			row[key] = values[i] ?? "";
		});
		return row;
	});

	return { columns, data };
}
