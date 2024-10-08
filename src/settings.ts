import Graphs from "main";
import { App, debounce, normalizePath, PluginSettingTab, Setting } from "obsidian";
import { LocationSuggester } from "./locationSuggester";

export interface GraphsSettings {
	height: number;
	width: number;
	alignment: string;
	defaultExportLocation: string;
	transparentBackground: boolean;
	exportType: string;
}

enum Alignment {
	left = "0 auto 0 0",
	center = "0 auto",
	right = "0 0 0 auto",
}

export enum ExportType {
	png = "PNG",
	svg = "SVG",
}

export const DEFAULT_SETTINGS: Partial<GraphsSettings> = {
	height: 300,
	width: 700,
	alignment: Alignment.center,
	defaultExportLocation: "",
	transparentBackground: false,
	exportType: ExportType.png,
};

export class GraphsSettingsTab extends PluginSettingTab {
	plugin: Graphs;

	constructor(app: App, plugin: Graphs) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(this.containerEl).setName("Style").setHeading();

		new Setting(this.containerEl)
		.setName("Height")
		.setDesc("Height of the graph in pixels.")
		.addText((text) => 
			text
				.setValue(this.plugin.settings.height.toString())
				.setPlaceholder("Enter a number")
				.onChange(async (value) => {
					this.plugin.settings.height = parseInt(value);
					document.documentElement.style.setProperty("--graph-height", this.plugin.settings.height + "px");
					await this.plugin.saveSettings();
			})
		);

		new Setting(this.containerEl)
		.setName("Width")
		.setDesc("Width of the graph in pixels.")
		.addText((text) => 
			text
				.setValue(this.plugin.settings.width.toString())
				.setPlaceholder("Enter a number")
				.onChange(async (value) => {
					this.plugin.settings.width = parseInt(value);
					document.documentElement.style.setProperty("--graph-width", this.plugin.settings.width + "px");
					await this.plugin.saveSettings();
			})
		);

		new Setting(this.containerEl) 
			.setName("Alignment")
			.setDesc("The horizontal alignment of the graph.")
			.addDropdown((dropdown) => {
				dropdown
					.addOption(Alignment.left, "left")
					.addOption(Alignment.center, "center")
					.addOption(Alignment.right, "right")
					.setValue(this.plugin.settings.alignment)
					.onChange(async (value) => {
						this.plugin.settings.alignment = value;
						document.documentElement.style.setProperty("--graph-alignment", this.plugin.settings.alignment);
						await this.plugin.saveSettings();
					})
			});

		new Setting(this.containerEl).setName("Export").setHeading();

		new Setting(this.containerEl).setName("Default location").addSearch((search) => {
			new LocationSuggester(this.app, search.inputEl);
			search.setPlaceholder("Default is vault root")
			.setValue(this.plugin.settings.defaultExportLocation)
			.onChange(debounce(async (path) => {
				this.plugin.settings.defaultExportLocation = normalizePath(path);
				await this.plugin.saveSettings();
			}))
		});

		new Setting(this.containerEl) 
			.setName("File type")
			.addDropdown((dropdown) => {
				dropdown
					.addOption(ExportType.png, ExportType.png)
					.addOption(ExportType.svg, ExportType.svg)
					.setValue(this.plugin.settings.exportType)
					.onChange(async (value) => {
						this.plugin.settings.exportType = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(this.containerEl).setName("Transparent background")
		.addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.transparentBackground)
			.onChange(async (value) => {
				this.plugin.settings.transparentBackground = value;
				await this.plugin.saveSettings();
			})
		});
	}
}
