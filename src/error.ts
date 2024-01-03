
export function renderError(error: string, element: HTMLElement) {
	const div = element.createEl("div");
	const span = div.createEl("span");
	
	span.innerText =  error;
}
