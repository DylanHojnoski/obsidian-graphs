import ObsidianGraphs from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface ObsidianGraphsSettings {
	height: number;
	width: number;
	alignment: string;
}

enum Alignment {
	left = "0 auto 0 0",
	center = "0 auto",
	right = "0 0 0 auto",
}

export const DEFAULT_SETTINGS: Partial<ObsidianGraphsSettings> = {
	height: 300,
	width: 700,
	alignment: Alignment.center,
};

export class ObsidianGraphsSettingsTab extends PluginSettingTab {
	plugin: ObsidianGraphs;

	constructor(app: App, plugin: ObsidianGraphs) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(this.containerEl)
		.setName("Height")
		.setDesc("Height of the graph in pixels")
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
		.setDesc("Width of the graph in pixels")
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
			.setDesc("The horizontal alignment of the graph")
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

		}
}
