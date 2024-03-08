import { Board, boards, JSXGraph } from 'jsxgraph';
import { Plugin } from 'obsidian';
import { renderError } from 'src/error';
import { GraphInfo, JSXElement } from 'src/types';
import { addElement, createBoard, parseCodeBlock, setMathFunctions } from 'src/utils';
import "./src/theme/obsidian.ts"

export default class ObsidianGraphs extends Plugin {
	currentFileName: string;
	count = 0;

	async onload () {

		setMathFunctions();

		this.app.workspace.on("file-open" , () => {

				// set the current file
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
				graphDiv.id = "graph" + this.count;
				this.count++;

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
		//@ts-ignore
		for (const key in boards) {
			//@ts-ignore
			const div = boards[key].containerObj;

			//@ts-ignore
			JSXGraph.freeBoard(boards[key]);
			div.remove();
		}
	}

 }
