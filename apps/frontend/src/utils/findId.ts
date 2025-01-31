export const findById = <T extends object & { id: string }>(
	fields: T[],
	id: string,
): T | undefined => fields.find((field) => field.id === id);

export const countById = <T extends object & { id: string }>(
	fields: T[],
	id: string,
): number => fields.filter((field) => field.id === id).length || 0;
