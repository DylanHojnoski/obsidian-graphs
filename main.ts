import { Board, GeometryElement, JSXGraph } from 'jsxgraph';
import { Plugin } from 'obsidian';
import { renderError } from 'src/error';
import { GraphInfo, JSXElement } from 'src/types';
import { addElement, createBoard, parseCodeBlock, setMathFunctions } from 'src/utils';
import "./src/theme/obsidian.ts"

export default class ObsidianGraphs extends Plugin {
	boards: Board[] = [];
	graphDivs: HTMLElement[] = [];

	async onload () {
		setMathFunctions();

		this.registerMarkdownCodeBlockProcessor("graph", (source, element, context) => {

				let graphInfo: GraphInfo;

				try {
					// parse the JSON from the code block
					graphInfo = parseCodeBlock(source);
				} catch (e) {
					renderError(e,element);
					return;
				}

				let board: Board;

				// create the div that contains the board
				const graphDiv = element.createEl("div", {cls: "jxgbox"});
				graphDiv.id = "box";
				this.graphDivs.push(graphDiv);


				try {
					// create the board
					board = createBoard(graphDiv, graphInfo);
				} catch (e) {
					renderError(e,element);
					return;
				}

				this.boards.push(board);

				const createdElements: JSXElement[] = [];

				if (graphInfo.elements != undefined) {
					// add every element to the graph 
					for (let i = 0; i < graphInfo.elements.length; i++) {
						try {
							addElement(board, graphInfo.elements[i], createdElements);
						} catch (e) {
							renderError(e,element);
							return;
						}
					}
				}

				element.replaceWith(graphDiv);
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

 }
