import { parseCsvToTable } from "../parseCSV";

describe("parseCsvToTable", () => {
	it("parses basic CSV into columns and data", () => {
		const csv = "id,name,age\n1,Alice,30\n2,Bob,25";

		const { columns, data } = parseCsvToTable(csv);

		expect(columns).toEqual([
			{ accessorKey: "id", header: "id" },
			{ accessorKey: "name", header: "name" },
			{ accessorKey: "age", header: "age" },
		]);

		expect(data).toEqual([
			{ id: "1", name: "Alice", age: "30" },
			{ id: "2", name: "Bob", age: "25" },
		]);
	});

	it("trims whitespace and handles empty values", () => {
		const csv = "id , name , age\n1 , Alice , 30\n2 , , 25";

		const { data } = parseCsvToTable(csv);

		expect(data[1]).toEqual({ id: "2", name: "", age: "25" });
	});

	it("throws error if CSV has only header", () => {
		const csv = "id,name,age";

		expect(() => parseCsvToTable(csv)).toThrow(
			"CSV must include headers and at least one row",
		);
	});

	it("supports custom delimiters", () => {
		const csv = "id|name|age\n1|Alice|30";

		const { data } = parseCsvToTable(csv, "|");

		expect(data[0]).toEqual({ id: "1", name: "Alice", age: "30" });
	});
});
