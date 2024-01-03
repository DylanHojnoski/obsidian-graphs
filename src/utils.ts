import { Board, JSXGraph, GeometryElement } from "jsxgraph";
import { MarkdownPostProcessorContext, parseYaml } from "obsidian";
import { ElementInfo, GraphInfo } from "./types";

export function parseCodeBlock(codeBlock: HTMLElement, context: MarkdownPostProcessorContext) :GraphInfo {
	let graph: GraphInfo = {bounds: [],keepAspectRatio: true, showNavigation: true, elements: []};
	const content = codeBlock.textContent;

	// there is nothing inside of the codeblock
	if (content == null) {
		return graph;
	}

	try {
		graph = parseYaml(content);

		if (graph.showNavigation == undefined) {
			graph.showNavigation = true;
		}

		return graph;
	} catch (e) {
		throw new SyntaxError(e);
	}
}

export function createBoard(graphDiv: HTMLElement, graphInfo: GraphInfo) :Board {

	if (graphInfo.bounds == undefined && graphInfo.elements == undefined && graphInfo.keepAspectRatio == undefined) {
		throw new SyntaxError("No info is defined");
	}

	validateBounds(graphInfo.bounds);

	const xmin = graphInfo.bounds[0];
	const xmax = graphInfo.bounds[2];
	const ymin = graphInfo.bounds[3];
	const ymax = graphInfo.bounds[1];

	const graph = JSXGraph.initBoard(graphDiv, {boundingBox: [xmin, ymax, xmax, ymin],
												axis: true,
												showCopyright: false,
												showNavigation: graphInfo.showNavigation,
												keepAspectRatio: graphInfo.keepAspectRatio});

	return graph;
}

function validateBounds(bounds: number[]) {
	const xmin = bounds[0];
	const xmax = bounds[2];
	const ymin = bounds[3];
	const ymax = bounds[1];

	if (bounds.length != 4) {
		throw new SyntaxError("The amount of bounds given is incorrect");
	}
	if (xmin >= xmax) {
		throw new SyntaxError("Bounds Xmin is greater than or equal to Xmax");
	}
	if (ymin >= ymax) {
		throw new SyntaxError("Bounds Ymin is greater than or equal to Ymax");
	}
}

export function addElement(board: Board, element: ElementInfo, createdElements: GeometryElement[]) {
	validateElement(element, createdElements);
	validateDef(element, createdElements);

	if (element.att == undefined) {
		createdElements.push(board.create(element.type, element.def));
	}
	else {
		createdElements.push(board.create(element.type, element.def, element.att));
	}
}

function validateElement(element: ElementInfo, createdElements: GeometryElement[]) {
	if (element.type == undefined &&  element.def == undefined) {
		throw new SyntaxError("Element " + createdElements.length + " type and def is not defined");
	}
	if (element.type == undefined) {
		throw new SyntaxError("Element " + createdElements.length + " type is not defined");
	}
	if (element.def == undefined) {
		throw new SyntaxError("Element " + createdElements.length + " def is not defined");
	}
}

function validateDef(element:  ElementInfo, createdElements: GeometryElement[]) {
	for (let i = 0; i < element.def.length; i++) {
		checkForComposedElements(element, i, createdElements);
		checkForFunction(element, i, createdElements);
	}
}

function checkForComposedElements(element: ElementInfo, eindex: number,  createdElements: GeometryElement[]) {
	// regex to check if there is a composed element
	const re  = new RegExp("^e[0-9]+$");
	const def = element.def[eindex];
	
	// if it is a string and passes the regex test add the element to def
	if (typeof def === 'string' && re.test(def)) {
		const index = Number.parseInt(def.substring(1,def.length));

		// checks if it is a valid element
		if (index >= createdElements.length) {
			throw new SyntaxError("Element " + eindex + " has invalid composed elements.");
		}
		else {
			element.def[eindex] = createdElements[index];
		}
	}
}

function checkForFunction(element: ElementInfo, eindex: number, createdElements: GeometryElement[]) {
	// regex to check if it is the start of a function
	const f = RegExp("^f:")

	// if the def is a string and passes regex crreate the function
	if (typeof element.def[eindex] === 'string' && f.test(element.def[eindex])) {
		// regex to check if function contains an element
		const re = RegExp("e[0-9]+");

		// function uses composed elements
		if (typeof element.def[0] === 'string' && re.test(element.def[eindex])) {
			// get the composed elements
			const composed = re.exec(element.def[eindex]);
			if (composed != null) {
				// go through composed elements and and validate and replace with proper string
				for (let i = 0; i < composed.length; i++) {
					const index = Number.parseInt(composed[i].replace("e", ""));
					if (index < 0 || index >= createdElements.length) {
						throw new SyntaxError("Element " + eindex + " has invalid composed elements.");
					}

					const equation: string = element.def[eindex].replace(re, "createdElements["+index+"].Value()");
					element.def[eindex] = function(x:number) {return eval(equation);};
				}
			}

		}
		else { // no composed elements
			const equation = element.def[eindex];
			element.def[eindex] = function(x: number) {return eval(equation);};
		}
	}
}
