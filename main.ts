import { loadMathJax, Plugin } from 'obsidian';
import { boards,  JSXGraph } from 'jsxgraph';
import { renderError } from 'src/error';
import { Graph, GraphInfo } from 'src/types';
import "./src/theme/obsidian.ts"
import { DEFAULT_SETTINGS, ObsidianGraphsSettings, ObsidianGraphsSettingsTab } from 'src/settings';
import { Utils } from 'src/utils';

export default class ObsidianGraphs extends Plugin {
	settings: ObsidianGraphsSettings
	currentFileName: string;
	count = 0;
	utils: Utils = new Utils();

	async onload () {
		await this.loadSettings();

		this.addSettingTab(new ObsidianGraphsSettingsTab(this.app, this));

		window.CodeMirror.defineMode("graph", config => window.CodeMirror.getMode(config, "yaml"));

		await loadMathJax();

		//@ts-ignore
		if (typeof MathJax !== "undefined") {
			//@ts-ignore
			MathJax.config.tex.inlineMath = [["$", "$"]];
			//@ts-ignore
			MathJax.config.tex.processEscapes = true;
			//@ts-ignore
			MathJax.config.chtml.adaptiveCSS = false;
			//@ts-ignore
			await MathJax.startup.getComponents();
		}

		this.app.workspace.on("file-open" , () => {
			this.cullBoards();
		});

		this.app.workspace.on("window-close", () => {
			this.cullBoards();
		})

		this.registerMarkdownCodeBlockProcessor("graph", (source, element) => {
			const currentFile = this.app.workspace.getActiveFile();
			if (currentFile) {
				this.currentFileName = currentFile.name.substring(0, currentFile.name.indexOf("."))
				this.currentFileName = this.currentFileName.replace(/\s/g, "");
			}

			let graphInfo: GraphInfo;

			try {
				// parse the JSON from the code block
				graphInfo = this.utils.parseCodeBlock(source);
			} catch (e) {
				renderError(e,element);
				return;
			}

			let graph: Graph;

			// if the current file name is undefined need to get the current file
			if (this.currentFileName == undefined) {
				const currentFile = this.app.workspace.getActiveFile();
				if (currentFile) {
					this.currentFileName = currentFile.name.substring(0, currentFile.name.indexOf("."))
					this.currentFileName = this.currentFileName.replace(/\s/g, "");
				}
			}

			// create the div that contains the board
			const graphDiv = element.createEl("div", {cls: "jxgbox " + this.currentFileName});
			graphDiv.id = "graph" + this.count;
			this.count++;

			try {
				// create the board
				graph = this.utils.createBoard(graphDiv, graphInfo);
			} catch (e) {
				renderError(e,element);
				return;
			}

			if (graphInfo.elements != undefined) {
				// add every element to the graph 
				for (let i = 0; i < graphInfo.elements.length; i++) {
					try {
						this.utils.addElement(graph, graphInfo.elements[i]);
					} catch (e) {
						renderError(e,element);
						return;
					}
				}
			}

		});
	}

	onunload() {
		//@ts-ignore
		for (const key in boards) {
			//@ts-ignore
			const div = boards[key].containerObj;

			//@ts-ignore
			JSXGraph.freeBoard(boards[key]);
			div.remove();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		document.documentElement.style.setProperty("--graph-height", this.settings.height + "px");
		document.documentElement.style.setProperty("--graph-width", this.settings.width + "px");
		document.documentElement.style.setProperty("--graph-alignment", this.settings.alignment);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	cullBoards() {
		const currentFile = this.app.workspace.getActiveFile();
		if (currentFile) {
			this.currentFileName = currentFile.name.substring(0, currentFile.name.indexOf("."))
			this.currentFileName = this.currentFileName.replace(/\s/g, "");
		}

		// get the active files
		const activeFileNames: string[] = [];
		const files = this.app.workspace.getLeavesOfType("markdown");
		files.forEach((file) => activeFileNames.push(file.getDisplayText().replace(/\s/g, "")));

		// go through all the boards and delete ones that are not in active files
		//@ts-ignore
		for (const key in boards) {
			let active = false;
			//@ts-ignore
			const div = boards[key].containerObj;

			// check the if it is in the active files
			for (const name of activeFileNames) {
				if (div.hasClass(name)) {
					active = true;
					break;
				}
			}

			// it is not in active files so delete
			if (!active) {
				//@ts-ignore
				boards[key].containerObj.remove();
				//@ts-ignore
				JSXGraph.freeBoard(boards[key]);
			}
		}
	}
}
