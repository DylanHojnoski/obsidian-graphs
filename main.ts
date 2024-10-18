import { loadMathJax, MarkdownPostProcessorContext, MarkdownView, Plugin } from 'obsidian';
import { JSXGraph } from 'jsxgraph';
import { renderError } from 'src/error';
import { Graph, GraphInfo } from 'src/types';
import "./src/theme/obsidian.ts"
import { DEFAULT_SETTINGS, GraphsSettings as GraphsSettings, GraphsSettingsTab } from 'src/settings';
import { Utils } from 'src/utils';
import { ExportModal } from 'src/exportModal';

export default class Graphs extends Plugin {
	settings: GraphsSettings
	count = 0;
	utils: Utils = new Utils();
	graphs: Map<string, Graph[]> = new Map();

	async onload () {
		await this.loadSettings();

		this.addSettingTab(new GraphsSettingsTab(this.app, this));

		window.CodeMirror.defineMode("graph", config => window.CodeMirror.getMode(config, "javascript"));
		window.CodeMirror.defineMode("graph3d", config => window.CodeMirror.getMode(config, "javascript"));

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

		this.addCommand({
			id: "export-graphs",
			name: "Export graphs",
			checkCallback: (checking: boolean) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode();
				if (view == "preview") {
					if (!checking) {
						const graphs = []
						const activeGraphs = this.graphs.get(this.getCurrentFileName()) ?? [];

						for (const graph of activeGraphs) {
							const div: HTMLElement = graph.board.containerObj;

							// check the if it is in the active files
							if (!div.hasClass("LivePreview")) {
								graphs.push(graph.board);
							}
						}
						new ExportModal(this, graphs).open();
					}
					return true
				}
				return false;
			}
		});

		this.registerMarkdownCodeBlockProcessor("graph", (source, element) => {
			this.handleCodeBlock(source, element, false);
		});
		this.registerMarkdownCodeBlockProcessor("graph3d", (source, element) => {
			this.handleCodeBlock(source, element, true);
		});
	}
	
	handleCodeBlock(source:string, element : HTMLElement, is3d : boolean) {
		{
			let graphInfo: GraphInfo;

			try {
				// parse the JSON from the code block
				graphInfo = this.utils.parseCodeBlock(source, is3d);
			} catch (e) {
				renderError(e,element);
				return;
			}

			let graph: Graph;

			// if the current file name is undefined need to get the current file
			const currentFileName = this.getCurrentFileName();

			// create the div that contains the board
			const graphDiv = element.createEl("div", {cls: "jxgbox"});

			if (this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() == "source") {
				graphDiv.addClass("LivePreview");
			}

			graphDiv.id = "graph" + this.count;
			this.count++;

			try {
				// create the board
				graph = this.utils.createBoard(graphDiv, graphInfo);
			} catch (e) {
				renderError(e,element);
				return;
			}

			if (this.graphs.has(currentFileName)) {
				this.graphs.get(currentFileName)?.push(graph);
			}
			else {
				this.graphs.set(currentFileName, [graph]);
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
		}
	}

	onunload() {
		for (const key of this.graphs.keys()) {
			const graphs: Graph[] = this.graphs.get(key) ?? [];

			for (const graph of graphs) {
				JSXGraph.freeBoard(graph.board);
				graph.board.containerObj.remove();
			}
			this.graphs.delete(key);
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

	getCurrentFileName(): string {
		let currentFileName = "";
		const currentFile = this.app.workspace.getActiveFile();
		if (currentFile) {
			currentFileName = currentFile.basename.replace(/\s/g, "");
		}
		return currentFileName;
	}

	cullBoards() {
		// get the active files
		const activeFileNames: string[] = [];
		const files = this.app.workspace.getLeavesOfType("markdown");
		files.forEach((file) => activeFileNames.push(file.getDisplayText().replace(/\s/g, "")));

		for (const key of this.graphs.keys()) {
			if (!activeFileNames.contains(key)) {
				const graphs: Graph[] = this.graphs.get(key) ?? [];

				for (const graph of graphs) {
					JSXGraph.freeBoard(graph.board);
					graph.board.containerObj.remove();
				}
				this.graphs.delete(key);
			}
		}
	}
}
