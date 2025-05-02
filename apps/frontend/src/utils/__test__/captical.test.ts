import { formatCapital, formatUnderScore } from "../capital";

describe("formatCapital", () => {
	it("should insert space before capital letters and capitalize first letter", () => {
		expect(formatCapital("helloWorld")).toBe("Hello World");
		expect(formatCapital("userProfilePage")).toBe("User Profile Page");
	});

	it("should return string with first letter capitalized if no internal caps", () => {
		expect(formatCapital("simple")).toBe("Simple");
	});

	it("should handle already capitalized strings", () => {
		expect(formatCapital("AlreadyFormatted")).toBe("Already Formatted");
	});

	it("should handle empty string", () => {
		expect(formatCapital("")).toBe("");
	});
});

describe("formatUnderScore", () => {
	it("should split by underscore and capitalize each word", () => {
		expect(formatUnderScore("hello_world")).toBe("Hello World");
		expect(formatUnderScore("user_profile_page")).toBe("User Profile Page");
	});

	it("should capitalize single word", () => {
		expect(formatUnderScore("simple")).toBe("Simple");
	});

	it("should handle multiple underscores", () => {
		expect(formatUnderScore("multi__underscore__test")).toBe(
			"Multi  Underscore  Test",
		);
	});

	it("should handle empty string", () => {
		expect(formatUnderScore("")).toBe("");
	});
});
