import { Board, JSXGraph, GeometryElement } from "jsxgraph";
import { finishRenderMath, parseYaml, renderMath } from "obsidian";
import { ElementInfo, GraphInfo, JSXElement, Types } from "./types";

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

export function addElement(board: Board, element: ElementInfo, createdElements: JSXElement[]) {
	validateElement(element, createdElements);

	if (element.att == undefined) {
		const createdElement: GeometryElement = board.create(element.type, element.def);
		createdElements.push({name: element.type, element: createdElement});
	}
	else {
		const createdElement: GeometryElement = board.create(element.type, element.def, element.att);
		createdElements.push({name: element.type, element: createdElement});
	}
}

function validateElement(element: ElementInfo, createdElements: JSXElement[]) {
	if (element.type == undefined &&  element.def == undefined) {
		throw new SyntaxError("Element " + createdElements.length + " type and def is not defined");
	}
	if (element.type == undefined) {
		throw new SyntaxError("Element " + createdElements.length + " type is not defined");
	}
	if (element.def == undefined) {
		throw new SyntaxError("Element " + createdElements.length + " def is not defined");
	}

	validateDef(element, createdElements);
	validateAtt(element, createdElements);
}

function validateDef(element:  ElementInfo, createdElements: JSXElement[]) {
	for (let i = 0; i < element.def.length; i++) {
		element.def[i] = checkComposedElements(element.def[i], createdElements);
		element.def[i] = checkFunction(element.def[i], createdElements);
	}

	if (element.type == Types.Text && element.def.length >= 3 && typeof  element.def[2] === 'string' && element.att != undefined && element.att.useMathJax) {
		const withoutDollarSigns = /(?<!\\)\$(.*?)(?<!\\)\$/gm;
		const matches = [...element.def[2].matchAll(withoutDollarSigns)];

		console.log(matches);
		for (let i = 0; i < matches.length; i++) {
			console.log("Match " +matches[i][0]);
			element.def[2] = element.def[2].replace(matches[i][0], renderMath(matches[i][1], true).outerHTML);
		}
		finishRenderMath();
	}
} 

function checkComposedElements(item: any, createdElements: JSXElement[]): any {
	const re  = new RegExp("^e[0-9]+$");
	// if it is a string and passes the regex test add the element to def
	if (typeof item === 'string' && re.test(item)) {
		const index = Number.parseInt(item.substring(1,item.length));

		// checks if it is a valid element
		if (index >= createdElements.length) {
			throw new SyntaxError("Element has invalid composed elements in def.");
		}

		return createdElements[index].element;
	}
	else if (Array.isArray(item)) {
		for (let i = 0; i < item.length; i++) {
			item[i] = checkComposedElements(item[i], createdElements);
		}
	}
	return item;
}

function validateAtt(element: ElementInfo, createdElements: JSXElement[]) {
	const re  = new RegExp("^e[0-9]+$");
	// check attributes for elements
	if (element.att != undefined) {
		if (typeof element.att.anchor === 'string' && re.test(element.att.anchor)) {
			const index = Number.parseInt(element.att.anchor.substring(1,element.att.anchor.length));

			// checks if it is a valid element
			if (index >= createdElements.length) {
				throw new SyntaxError("Element " + element.type + " has invalid composed elements in att.");
			}
			else {
				element.att.anchor = createdElements[index].element;
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

function checkFunction(item: any, createdElements: JSXElement[]): any {
	// regex to check if it is the start of a function
	const f = RegExp("f:")

	// if the def is a string and passes regex crreate the function
	if (typeof item === 'string' && f.test(item)) {
		// regex to check if function contains an element
		const re = RegExp(/e[0-9]+/);
		item = item.replace("f:", "")

		// function uses composed elements
		if (typeof item === 'string' && re.test(item)) {
			// get the composed elements
			let composed = re.exec(item);
			while (composed != null) {
				// go through composed elements and and validate and replace with proper string
				const index = Number.parseInt(composed[0].replace("e", ""));
				if (index < 0 || index >= createdElements.length) {
					throw new SyntaxError("Element has invalid composed elements in function.");
				}

				if (createdElements[index].name == Types.Slider || createdElements[index].name  == Types.Riemannsum || createdElements[index].name == Types.Integral) {
					item = item.replace(re, "createdElements["+index+"].element.Value()");
				}
				else {
					item = item.replace(re, "createdElements["+index+"].element");
				}


				composed = re.exec(item);
			}

		}
		const equation = item;
		// create function that is used to calculate the values
		return  new Function(...argsArray, "createdElements", "x", "y", "return " + equation + ";").bind(args, ...mathFunctions, createdElements);
	}
	else if (Array.isArray(item)) {
		for (let i = 0; i < item.length; i++) {
			item[i] = checkFunction(item[i], createdElements);
		}
	}
	return item;
}
