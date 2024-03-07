import { Board, boards, JSXGraph } from 'jsxgraph';
import { Plugin } from 'obsidian';
import { renderError } from 'src/error';
import { GraphInfo, JSXElement } from 'src/types';
import { addElement, createBoard, parseCodeBlock, setMathFunctions } from 'src/utils';
import "./src/theme/obsidian.ts"


export default class ObsidianGraphs extends Plugin {
	currentFileName: string;

	async onload () {

		setMathFunctions();

		this.app.workspace.on("file-open" , () => {

				const currentFile = this.app.workspace.getActiveFile();
				if (currentFile) {
					this.currentFileName = currentFile.name.substring(0, currentFile.name.indexOf("."))
					this.currentFileName = this.currentFileName.replace(/\s/g, "");
				}

				const activeFileNames: string[] = [];
				const files = this.app.workspace.getLeavesOfType("markdown");
				files.forEach((file) => activeFileNames.push(file.getDisplayText().replace(/\s/g, "")));

				for (const key in boards) {
					let active = false;
					const div = boards[key].containerObj;
					
					for (const name of activeFileNames) {
						if (div.hasClass(name)) {
							active = true;
							break;
						}
					}

					if (!active) {
						console.log("free");
						JSXGraph.freeBoard(boards[key]);
						div.remove();
					}
				}
		})

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
				const graphDiv = element.createEl("div", {cls: "jxgbox " + this.currentFileName});
				graphDiv.id = "box";


				try {
					// create the board
					board = createBoard(graphDiv, graphInfo);
				} catch (e) {
					renderError(e,element);
					return;
				}

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
		for (const key in boards) {
			const div = boards[key].containerObj;

			JSXGraph.freeBoard(boards[key]);
			div.remove();
		}
	}

 }
