import ObsidianGraphs from "main";
import {  debounce, Modal, Notice, Setting } from "obsidian";
import { LocationSuggester } from "./LocationSuggester";

export class ExportModal extends Modal {
	plugin: ObsidianGraphs;
	svgs: string[];
	saveLocation: string;
	exportButtons: HTMLButtonElement[];

	constructor(plugin: ObsidianGraphs,svgs: string[]) {
		super(plugin.app);
		this.plugin = plugin
		this.svgs = svgs;
		this.saveLocation = this.plugin.settings.defaultExportLocation
		this.exportButtons = [];
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		if (contentEl.parentElement != undefined) {
			contentEl.parentElement.addClass("exportGraphModal");
		}

		contentEl.createEl("h1", { text: "Export Graphs" });
		contentEl.createEl("p", {text: "Export graphs as SVGs. If a graph in this file is not appearing it has not been rendered in view yet and you need to scroll down in the file."})
		contentEl.createEl("p", {text: "Graphs will no longer be interactable or adapt colors to Obsidian theme."}).style.color = "var(--text-faint)"

		const settings = contentEl.createDiv();

		const locationInput = new Setting(settings).setName("Export location").addSearch((search) => {
			new LocationSuggester(this.app, search.inputEl);
			search.setPlaceholder("Default is vault root")
			.setValue(this.saveLocation)
			.onChange(debounce(async (path) => {
				this.saveLocation = path;
			}))
		});

		locationInput.settingEl.style.borderTop = "1px solid var(--background-modifier-border)";
		locationInput.settingEl.style.paddingTop = "0.75em";

		new Setting(settings)
		.addButton((btn) => {
			btn
			.setButtonText("Export All")
			.setCta()
			.onClick(() => {
				for (const button of this.exportButtons) {
					button.click();
				}
			});
		});

		for (let i = 0; i < this.svgs.length; i++) {
			const container = settings.createDiv();
			container.addClass("exportGraph");
 
			container.createEl("h1", { text: "Graph " + i});
 
			let fileName = this.plugin.getCurrentFileName() + "-graph-" + i;
			container.innerHTML += this.svgs[i];
			if (container.lastElementChild?.getBoundingClientRect().width == 0) {
				container.remove();
				continue;
			}

			const settingsContainer =  container.createDiv();
			settingsContainer.addClass("exportGraphSettings");

			const nameInput = new Setting(settingsContainer).setName("File name").addText((text) => {
				text.onChange(async (value) => {
					fileName = value;
				}).setValue(fileName);
			});

			nameInput.settingEl.style.borderTop = "1px solid var(--background-modifier-border)";
			nameInput.settingEl.style.paddingTop = "0.75em";

			new Setting(settingsContainer)
			.addButton((btn) => {
				btn
				.setButtonText("Export")
				.setCta()
				.onClick(async () => {
					if (this.saveLocation.length > 1 && this.saveLocation.at(this.saveLocation.length-1) != "/") {
						this.saveLocation += "/";
					}
					else if (this.saveLocation == "/") {
						this.saveLocation = "";
					}

					const path = this.saveLocation + fileName + ".svg";
					const file = this.app.vault.getFileByPath(path);
					if (!file) {
						this.app.vault.create(path, this.svgs[i]);
					}
					else {
						new Notice("File \"" + path + "\" already exists", 5000);
					}

				});
				this.exportButtons.push(btn.buttonEl);
			});
		}
	}
}
