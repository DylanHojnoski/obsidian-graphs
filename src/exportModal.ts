import { Board } from "jsxgraph";
import Graphs from "main";
import {  debounce, Modal, normalizePath, Notice, Setting } from "obsidian";
import { LocationSuggester } from "./locationSuggester";

export class ExportModal extends Modal {
	plugin: Graphs;
	svgs: string[];
	saveLocation: string;
	exportButtons: HTMLButtonElement[];
	transparentBackground: boolean;
	graphs: HTMLElement[];
	boards: Board[];

	constructor(plugin: Graphs, boards: Board[]) {
		super(plugin.app);
		this.plugin = plugin
		this.saveLocation = this.plugin.settings.defaultExportLocation
		this.transparentBackground = this.plugin.settings.transparentBackground;
		this.exportButtons = [];
		this.graphs = [];
		this.boards = boards;
		this.svgs = [];
	}

	exportGraph(graph: Board, transparentBackground: boolean) {
		const text = graph.renderer.dumpToDataURI();
		const ar = text.split(",");
		let  decoded =  atob(ar[1]);
		const re  = RegExp(/var\(\s*(--[\w-]+)\s*\)/g);
		let matches = re.exec(decoded);
		while (matches != null) {
				decoded = decoded.replace(matches[0], document.body.getCssPropertyValue(matches[1]));
				matches = re.exec(decoded);
		}

		const insertPosition = decoded.indexOf(">")+1;
		let beginning = decoded.slice(0, insertPosition);
		const ending = decoded.slice(insertPosition);

		if (!transparentBackground) {
			beginning = beginning.replace("style=\"", "style=\"background-color: " + document.body.getCssPropertyValue("--background-secondary") + "; ");
		}

		const  style = "<style>.JXG_navigation {display: none;}</style>"
		decoded = beginning + style + ending;

		return decoded;
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		if (contentEl.parentElement != undefined) {
			contentEl.parentElement.addClass("exportGraphModal");
		}

		this.setTitle("Export Graphs");
		contentEl.createEl("p", {text: "Export graphs as SVGs. If a graph in this file is not appearing it has not been rendered in view yet and you need to scroll down in reading mode."})
		contentEl.createEl("p", {text: "Graphs will no longer be interactable or adapt colors to Obsidian theme."}).style.color = "var(--text-faint)"


		const settings = contentEl.createDiv();

		new Setting(settings).setName("Export location").addSearch((search) => {
			new LocationSuggester(this.app, search.inputEl);
			search.setPlaceholder("Default is vault root")
			.setValue(this.saveLocation)
			.onChange(debounce(async (path) => {
				this.saveLocation = normalizePath(path);
			}))
		});

		new Setting(settings).setName("Transparent background")
		.addToggle((toggle) => {
			toggle
			.setValue(this.transparentBackground)
			.onChange(async (value) => {
				this.transparentBackground = value;

				for (let i = 0; i < this.graphs.length; i++) {
					const svg = this.graphs[i].getElementsByTagName("svg").item(0);

					if (svg) {
						if (this.transparentBackground) {
							svg.style.backgroundColor = "transparent";
						}
						else {
							svg.style.backgroundColor = document.body.getCssPropertyValue("--background-secondary").toString();
						} 
					}
				}
			})
		})

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


		for (let i = 0; i < this.boards.length; i++) {
			const container = settings.createDiv();
			let graphNumber = this.svgs.length + 1;
			container.addClass("exportGraph");
 
			container.createEl("h1", { text: "Graph " + graphNumber});
 
			let fileName = this.plugin.getCurrentFileName() + "-graph-" + graphNumber;

			const svgContainer = container.createDiv();
			svgContainer.empty();
			svgContainer.addClass("svgContainer");
			const svg = this.exportGraph(this.boards[i], this.transparentBackground);
			svgContainer.innerHTML = svg;

			if (svgContainer.firstElementChild?.getAttribute("width") == "0") {
				graphNumber--;
				container.remove();
				continue;
			}

			this.svgs.push(svg);

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
						this.app.vault.create(path, this.svgs[graphNumber-1]);
					}
					else {
						new Notice("File \"" + path + "\" already exists", 5000);
					}

				});
				this.exportButtons.push(btn.buttonEl);
				this.graphs.push(container);
			});
		}
	}
}
