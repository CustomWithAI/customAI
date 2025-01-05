"use client";
const MAX_SAVED_FORMS = 5;

export const getAllSavedForms = () => {
	if (typeof window !== "undefined") {
		const savedForms = localStorage.getItem("savedForms");
		return savedForms ? JSON.parse(savedForms) : {};
	}
};

export const saveFormData = (formName: string, formData: any) => {
	const savedForms = getAllSavedForms();

	if (Object.keys(savedForms).length >= MAX_SAVED_FORMS) {
		const oldestForm = Object.keys(savedForms)[0];
		delete savedForms[oldestForm];
	}
	savedForms[formName] = formData;

	if (typeof window !== "undefined") {
		localStorage.setItem("savedForms", JSON.stringify(savedForms));
	}
};

export const getSavedFormData = (formName: string, defaultValues: any) => {
	const savedForms = getAllSavedForms();
	return savedForms[formName] || defaultValues;
};

export const deleteSaveData = (formName: string) => {
	const savedForms = getAllSavedForms();

	if (savedForms[formName]) {
		delete savedForms[formName];
		if (typeof window !== "undefined") {
			localStorage.setItem("savedForms", JSON.stringify(savedForms));
		}
	}
};
