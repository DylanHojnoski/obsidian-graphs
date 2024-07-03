import { Board, JSXGraph, GeometryElement } from "jsxgraph";
import { parseYaml } from "obsidian";
import { ElementInfo, GraphInfo, JSXElement, Types } from "./types";

export class Utils {

	argsArray: string[];
	mathFunctions: any[];

	constructor() {
		this.argsArray =  Object.getOwnPropertyNames(Math) ;
		this.mathFunctions = [];

		for (const name of this.argsArray) {
			//@ts-ignore
			this.mathFunctions.push(Math[name]);
		}

	}

	parseCodeBlock(source: string) :GraphInfo {
		let graph: GraphInfo = {bounds: [0,0,0,0],
								maxBoundingBox: JXG.Options.board.maxBoundingBox,
								keepAspectRatio: false,
								drag: true,
								showNavigation: true,
								axis: true, defaultAxes: JXG.Options.board.defaultAxes,
								elements: [],
								height: undefined,
								width: undefined};

		// there is nothing inside of the codeblock
		if (source == null || source == "") {
			return graph;
		}

		try {
			graph = parseYaml(source);

			if (graph.maxBoundingBox == undefined) {
				graph.maxBoundingBox = JXG.Options.board.maxBoundingBox;
			}

			if (graph.showNavigation == undefined) {
				graph.showNavigation = true;
			}

			if (graph.axis == undefined) {
				graph.axis = true;
			}

			if (graph.defaultAxes == undefined) {
				graph.defaultAxes = JXG.Options.board.defaultAxes;
			}

			if (graph.drag == undefined) {
				graph.drag = true;
			}

			return graph;
		} catch (e) {
			throw new SyntaxError(e);
		}
	}

	createBoard(graphDiv: HTMLElement, graphInfo: GraphInfo) :Board {

		// make sure that the are defined
		if (graphInfo.bounds == undefined && graphInfo.elements == undefined && graphInfo.keepAspectRatio == undefined) {
			throw new SyntaxError("No info is defined");
		}

		this.validateBounds(graphInfo.bounds);

		// create the board for the graph
		const graph = JSXGraph.initBoard(graphDiv, {boundingBox: graphInfo.bounds,
													maxBoundingBox: graphInfo.maxBoundingBox,
													drag: {enabled: graphInfo.drag},
													axis: graphInfo.axis,
													showNavigation: graphInfo.showNavigation,
													defaultAxes: graphInfo.defaultAxes,
													//@ts-ignore
													theme: 'obsidian',
													keepAspectRatio: graphInfo.keepAspectRatio});

		if (graphInfo.height) {
			graphDiv.style.height = graphInfo.height + "px";
		}
		if (graphInfo.width) {
			graphDiv.style.maxWidth = graphInfo.width + "px";
		}

		return graph;
	}

	validateBounds(bounds: number[]) {
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

	addElement(board: Board, element: ElementInfo, createdElements: JSXElement[]) {
		this.validateElement(element, createdElements);
		let createdElement: GeometryElement;

		if (element.att == undefined) {
			createdElement = board.create(element.type, element.def);
		}
		else {
			createdElement = board.create(element.type, element.def, element.att);
		}
		createdElements.push({name: element.type, element: createdElement});
	}

	validateElement(element: ElementInfo, createdElements: JSXElement[]) {
		if (element.type == undefined &&  element.def == undefined) {
			throw new SyntaxError("Element " + createdElements.length + " type and def is not defined");
		}
		if (element.type == undefined) {
			throw new SyntaxError("Element " + createdElements.length + " type is not defined");
		}
		if (element.def == undefined) {
			throw new SyntaxError("Element " + createdElements.length + " def is not defined");
		}

		this.validateDef(element.def, createdElements);
		this.validateAtt(element, createdElements);
	}

	validateDef(def: any[], createdElements: JSXElement[]) {
		for (let i = 0; i < def.length; i++) {
			if (Array.isArray(def[i])) {
				this.validateDef(def[i], createdElements);
			}

			const index = this.checkComposedElements(def[i], createdElements);
			if (index >= 0) {
				def[i] = createdElements[index].element;
			}
			def[i] = this.checkFunction(def[i], createdElements);
		}
	}

	checkComposedElements(item: any, createdElements: JSXElement[]): number {
		const re  = new RegExp("^e[0-9]+$");
		// if it is a string and passes the regex test add the element to def
		if (typeof item === 'string' && re.test(item)) {
			const index = Number.parseInt(item.substring(1,item.length));

			// checks if it is a valid element
			if (index >= createdElements.length) {
				throw new SyntaxError("Element has invalid composed element.");
			}

			return index;
		}
		return -1;
	}

	validateAtt(element: ElementInfo, createdElements: JSXElement[]) {
		// check attributes for elements
		if (element.att != undefined) {
			if (typeof element.att.anchor === 'string') {
				const index = this.checkComposedElements(element.att.anchor, createdElements);
				element.att.anchor = createdElements[index].element;
			}
			if (typeof element.att.fillColor === 'string') {
				element.att.fillColor = this.changeColorValue(element.att.fillColor);
			}
			if (typeof element.att.strokeColor === 'string') {
				element.att.strokeColor = this.changeColorValue(element.att.strokeColor);
			}
			if (typeof element.att.highlightFillColor === 'string') {
				element.att.highlightFillColor= this.changeColorValue(element.att.highlightFillColor);
			}
			if (typeof element.att.highlightStrokeColor === 'string') {
				element.att.highlightStrokeColor = this.changeColorValue(element.att.highlightStrokeColor);
			}
		}
	}

	changeColorValue(value: string): string {
		switch(value.toLowerCase()) {
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

	checkFunction(item: any, createdElements: JSXElement[]): any {
		// regex to check if it is the start of a function
		const f = RegExp("f:")

		// if the def is a string and passes regex crreate the function
		if (typeof item === 'string' && f.test(item)) {
			// regex to check if function contains an element
			const re = RegExp(/e[0-9]+/);
			item = item.replace(f, "")

			// function uses composed elements
			if (typeof item === 'string' && re.test(item)) {
				// get the composed elements
				let composed = re.exec(item);
				while (composed != null) {
					// go through composed elements and and validate and replace with proper string
					const index = this.checkComposedElements(composed[0], createdElements);

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
			return  new Function(...this.argsArray, "createdElements", "x", "y", "return " + equation + ";").bind({}, ...this.mathFunctions, createdElements);
		}
		else if (Array.isArray(item)) {
			for (let i = 0; i < item.length; i++) {
				item[i] = this.checkFunction(item[i], createdElements);
			}
		}
		return item;
	}

}

