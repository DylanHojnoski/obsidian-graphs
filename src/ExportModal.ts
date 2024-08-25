import ObsidianGraphs from "main";
import {  Modal, Setting } from "obsidian";

export class ExportModal extends Modal {
	plugin: ObsidianGraphs;
	svgs: string[];
	saveLocation: string;

	constructor(plugin: ObsidianGraphs,svgs: string[]) {
		super(plugin.app);
		this.plugin = plugin
		this.svgs = svgs;
		this.saveLocation = "";
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		// Header
		contentEl.createEl("h1", { text: "Export Graphs" });

		const settings = contentEl.createDiv();

		new Setting(settings).setName("Location").addText((text) => {
			text.onChange(async (value) => {
				this.saveLocation = value;
			}).setPlaceholder("Default is vault home folder");
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

			new Setting(settingsContainer).setName("File name").addText((text) => {
				text.onChange(async (value) => {
					fileName = value;
				}).setValue(fileName);
			});

			new Setting(settingsContainer)
			.addButton((btn) => {
				btn
				.setButtonText("Export")
				.setCta()
				.onClick(async () => {
					if (this.saveLocation.at(this.saveLocation.length-1) != "/") {
						this.saveLocation = this.saveLocation + "/";

					}
					this.app.vault.create(this.saveLocation + fileName + ".svg", this.svgs[i]);
				});

				btn.buttonEl.style.borderTopWidth = "0p";
			});


		}
	}

}
