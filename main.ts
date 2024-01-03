import { Board, GeometryElement, JSXGraph } from 'jsxgraph';
import { Plugin } from 'obsidian';
import { renderError } from 'src/error';
import { GraphInfo } from 'src/types';
import { addElement, createBoard, parseCodeBlock } from 'src/utils';


interface ObsidianGraphsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianGraphsSettings = {
	mySetting: 'default'
}

export default class ObsidianGraphs extends Plugin {
	settings: ObsidianGraphsSettings;
	boards: Board[] = [];
	graphDivs: HTMLElement[] = [];

	async onload () {
		await this.loadSettings();

		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks: HTMLElement[]  = element.findAll("code");

			// go through all codeblocks and check if they are graph
			for (const codeblock of codeblocks) {

				if (codeblock.className.replace("language-", "") != "graph") {
					continue;
				}

				let graphInfo: GraphInfo;

				try {
					// parse the JSON from the code block
					graphInfo =  parseCodeBlock(codeblock, context);
				} catch (e) {
					renderError(e, codeblock);
					continue;
				}

				let board: Board;

				// create the div that contains the board
				const graphDiv = codeblock.createEl("div", {cls: "jxgbox"});
				graphDiv.id = "box";
				this.graphDivs.push(graphDiv);

				try {
					// create the board
					board = createBoard(graphDiv, graphInfo);
				} catch (e) {
					renderError(e, codeblock);
					continue;
				}

				this.boards.push(board);

				const createdElements: GeometryElement[] = [];

				let elementError = false;
				if (graphInfo.elements != undefined) {

					// add every element to the graph 
					for (let i = 0; i < graphInfo.elements.length; i++) {
						try {
							addElement(board, graphInfo.elements[i], createdElements);
						} catch (e) {
							renderError(e, codeblock);
							elementError = true;
							continue;
						}
					}
				}

				// if the is no elementError then display the graph
				if (!elementError) {
					codeblock.replaceWith(graphDiv);
				}
			}
		});

	}

	onunload() {
		for (const board of this.boards) {
			JSXGraph.freeBoard(board);
		}

		for (const div of this.graphDivs) {
			div.remove();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
