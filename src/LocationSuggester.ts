import { AbstractInputSuggest, App, TAbstractFile, TFolder } from "obsidian";

export class LocationSuggester extends AbstractInputSuggest<string> {

    private inputEl: HTMLInputElement;
    private paths: TAbstractFile[];

    constructor(app: App, inputEl: HTMLInputElement) {
        super(app, inputEl);
        this.inputEl = inputEl;
        this.paths = this.app.vault.getAllLoadedFiles().filter((file) => file instanceof TFolder);
    }

    getSuggestions(inputStr: string): string[] {
        const suggestions: string[] = [];
        const lowerCaseInputStr = inputStr.toLowerCase();

        this.paths.forEach((path: TAbstractFile) => {
			if (path.path.toLowerCase().contains(lowerCaseInputStr)) {
				suggestions.push(path.path);
			}
        });

        return suggestions;
    }

    renderSuggestion(path: string, el: HTMLElement): void {
        el.setText(path);
    }

    selectSuggestion(path: string): void {
        this.inputEl.value = path;
        this.inputEl.trigger("input");
        this.inputEl.blur();
        this.close();
    }
}
