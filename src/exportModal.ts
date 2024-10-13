import { Board } from "jsxgraph";
import Graphs from "main";
import {  debounce, Modal, normalizePath, Notice, Setting } from "obsidian";
import { LocationSuggester } from "./locationSuggester";
import { ExportType } from "./settings";

export class ExportModal extends Modal {
	plugin: Graphs;
	svgs: string[];
	saveLocation: string;
	exportButtons: HTMLButtonElement[];
	transparentBackground: boolean;
	exportType: string;
	graphs: HTMLElement[];
	boards: Board[];

	constructor(plugin: Graphs, boards: Board[]) {
		super(plugin.app);
		this.plugin = plugin
		this.saveLocation = this.plugin.settings.defaultExportLocation
		this.transparentBackground = this.plugin.settings.transparentBackground;
		this.exportType = this.plugin.settings.exportType;
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
		else {
			beginning = beginning.replace("style=\"", "style=\"background-color: transparent; ");
		}

		const  style = "<style>.JXG_navigation {display: none;}</style>"
		decoded = beginning + style + ending;

		return decoded;
	}

	renderCanvas(canvas: HTMLCanvasElement, svg: string) {
		const widthString = svg.match(/width="([0-9]+.?[0-9]+)"/);
		const heightString = svg.match(/height="([0-9]+.?[0-9]+)"/);

		let width = 0;
		let height = 0;

		if (widthString && heightString) {
			width = Number.parseFloat(widthString[1]);
			height = Number.parseFloat(heightString[1]);
		}

		const ctx = canvas.getContext("2d");
		if (ctx && width && height) {
			ctx.canvas.width = width;
			ctx.canvas.height = height;
		}
		const img = new Image(width, height);
		const svgdata = "data:image/svg+xml;base64," + btoa(svg);
		img.src = svgdata;

		img.onload = () => {
			if (ctx) {
				ctx.drawImage(img, 0, 0);
			}
		};
	}

	async onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		if (contentEl.parentElement != undefined) {
			contentEl.parentElement.addClass("exportGraphModal");
		}

		this.setTitle("Export Graphs");
		contentEl.createEl("p", {text: "Export graphs as PNG or SVG. If a graph in this file is not appearing it has not been rendered in view yet and you need to scroll down in reading mode."})
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

		new Setting(settings) 
			.setName("File type")
			.addDropdown((dropdown) => {
				dropdown
					.addOption(ExportType.png, ExportType.png)
					.addOption(ExportType.svg, ExportType.svg)
					.setValue(this.plugin.settings.exportType)
					.onChange(async (value) => {
						this.exportType = value;
					})
			});

		new Setting(settings).setName("Transparent background")
		.addToggle((toggle) => {
			toggle
			.setValue(this.transparentBackground)
			.onChange(async (value) => {
				this.transparentBackground = value;

				for (let i = 0; i < this.graphs.length; i++) {
					const canvas = this.graphs[i].getElementsByTagName("canvas").item(0);
					let svg = this.svgs[i];

					if (this.transparentBackground) {
						svg = svg.replace(/style="background-color: #[0-9a-fA-F]+; /, "style=\"background-color: transparent; ");
					}
					else {
						svg = svg.replace("style=\"background-color: transparent; ", "style=\"background-color: " + document.body.getCssPropertyValue("--background-secondary") + "; ")
					} 

					this.svgs[i] = svg;

					if (svg && canvas) {
						this.renderCanvas(canvas, svg);
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
			const svg = this.exportGraph(this.boards[i], this.transparentBackground);
			if (svg != null) {
				this.svgs.push(svg);
			}

			const widthString = svg.match(/width="([0-9]+.?[0-9]+)"/);
			const heightString = svg.match(/height="([0-9]+.?[0-9]+)"/);

			let width = 0;
			let height = 0;

			if (widthString && heightString) {
				width = Number.parseFloat(widthString[1]);
				height = Number.parseFloat(heightString[1]);
			}

			if (width <=  0 || height <= 0) {
				graphNumber--;
				container.remove();
				continue;
			}

			const canvas = container.createEl("canvas");
			canvas.empty();

			this.renderCanvas(canvas, svg)

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
					const path = this.saveLocation + fileName + "." + this.exportType.toLowerCase() ;
					const file = this.app.vault.getFileByPath(path);
					if (!file) {

						if (this.exportType == ExportType.png) {
							const arr = canvas.toDataURL("image/png").split(",");
							const bstr = atob(arr[1]); // Decode the base64 string
							const u8arr = new Uint8Array(bstr.length);

							// Convert the binary string to an array buffer
							for (let i = 0; i < bstr.length; i++) {
								u8arr[i] = bstr.charCodeAt(i);
							}

							this.app.vault.createBinary(path, u8arr);
						}
						else {
							this.app.vault.create(path, this.svgs[graphNumber-1]);
						}
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
