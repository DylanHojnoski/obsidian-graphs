import { Board, JSXGraph, GeometryElement } from "jsxgraph";
import { parseYaml } from "obsidian";
import { ElementInfo, GraphInfo } from "./types";

const args = {};
const argsArray = Object.getOwnPropertyNames(Math) ;
const mathFunctions: any[] = [];

export function setMathFunctions() {
	for (const name of Object.getOwnPropertyNames(Math)) {
		//@ts-ignore
		mathFunctions.push(Math[name]);
	}
}

export function parseCodeBlock(source: string) :GraphInfo {
	let graph: GraphInfo = {bounds: [], keepAspectRatio: false, showNavigation: true, axis: true,  elements: []};

	// there is nothing inside of the codeblock
	if (source == null || source == "") {
		return graph;
	}

	try {
		graph = parseYaml(source);

		if (graph.showNavigation == undefined) {
			graph.showNavigation = true;
		}

		if (graph.axis == undefined) {
			graph.axis = true;
		}

		return graph;
	} catch (e) {
		throw new SyntaxError(e);
	}
}

export function createBoard(graphDiv: HTMLElement, graphInfo: GraphInfo) :Board {

	// make sure that the are defined
	if (graphInfo.bounds == undefined && graphInfo.elements == undefined && graphInfo.keepAspectRatio == undefined) {
		throw new SyntaxError("No info is defined");
	}

	validateBounds(graphInfo.bounds);

	const xmin = graphInfo.bounds[0];
	const xmax = graphInfo.bounds[2];
	const ymin = graphInfo.bounds[3];
	const ymax = graphInfo.bounds[1];

	// create the board for the graph
	const graph = JSXGraph.initBoard(graphDiv, {boundingBox: [xmin, ymax, xmax, ymin],
												axis: graphInfo.axis,
												showCopyright: false,
												showNavigation: graphInfo.showNavigation,
												//@ts-ignore
												theme: 'obsidian',
												pan: {needTwoFingers: true},
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

	if (element.att != undefined) {
		if (typeof element.att.anchor === 'string' && re.test(element.att.anchor)) {
			const index = Number.parseInt(element.att.anchor.substring(1,element.att.anchor.length));

			// checks if it is a valid element
			if (index >= createdElements.length) {
				throw new SyntaxError("Element " + eindex + " has invalid composed elements.");
			}
			else {
				element.att.anchor = createdElements[index];
			}
		}
		if (typeof element.att.fillColor === 'string') {
			element.att.fillColor = changeColorValue(element.att.fillColor);

		}
		if (typeof element.att.strokeColor === 'string') {
			element.att.strokeColor = changeColorValue(element.att.strokeColor);
		}
		if (typeof element.att.highlightFillColor === 'string') {
			element.att.highlightFillColor= changeColorValue(element.att.highlightFillColor);

		}
		if (typeof element.att.highlightStrokeColor === 'string') {
			element.att.highlightStrokeColor = changeColorValue(element.att.highlightStrokeColor);
		}

	}
}

function changeColorValue(value: string): string {
	switch(value) {
		case "red":
			return "var(--color-red)";
		case "orange":
			return "var(--color-orange)";
		case "yellow":
			return "var(--color-yellow)";
		case "green":
			return "var(--color-green)";
		case "cyan":
			return "var(--color-cyan)";
		case "blue":
			return "var(--color-blue)";
		case "purple":
			return "var(--color-purple)";
		case "pink":
			return "var(--color-pink)";
		default:
			return value;
	}
}

function checkForFunction(element: ElementInfo, eindex: number, createdElements: GeometryElement[]) {
	// regex to check if it is the start of a function
	const f = RegExp("f:")

	// if the def is a string and passes regex crreate the function
	if (typeof element.def[eindex] === 'string' && f.test(element.def[eindex])) {
		// regex to check if function contains an element
		const re = RegExp(/e[0-9]+/);
		element.def[eindex] = element.def[eindex].replace("f:", "")

		// function uses composed elements
		if (typeof element.def[eindex] === 'string' && re.test(element.def[eindex])) {
			// get the composed elements
			let composed = re.exec(element.def[eindex]);
			while (composed != null) {
				// go through composed elements and and validate and replace with proper string
				const index = Number.parseInt(composed[0].replace("e", ""));
				if (index < 0 || index >= createdElements.length) {
					throw new SyntaxError("Element " + eindex + " has invalid composed elements.");
				}

				element.def[eindex] = element.def[eindex].replace(re, "createdElements["+index+"].Value()");
				composed = re.exec(element.def[eindex]);
			}

			argsArray.push("createdElements");
			argsArray.push("x");
			argsArray.push("y");

			const equation = element.def[eindex];
			// create function that is used to calculate the values
			element.def[eindex] = new Function(argsArray.toString(), "return " + equation + ";").bind(args, ...mathFunctions, createdElements);
		}
		else { // no composed elements
			const equation = element.def[eindex];

			argsArray.push("x");
			argsArray.push("y");

			element.def[eindex] = new Function(argsArray.toString(), "return " + equation + ";").bind(args, ...mathFunctions);
		}
	}
}
