import { Board, JSXGraph, GeometryElement, View3D } from "jsxgraph";
import { App, parseYaml } from "obsidian";
import { Att3d, Attributes, ElementInfo, Graph, GraphInfo, JSXElement, Types } from "./types";

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
								width: undefined,
								bounds3d: undefined,
								att3d: undefined};

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

	createBoard(graphDiv: HTMLElement, graphInfo: GraphInfo): Graph {

		// make sure that the are defined
		if (graphInfo.bounds == undefined && graphInfo.elements == undefined && graphInfo.keepAspectRatio == undefined) {
			throw new SyntaxError("No info is defined");
		}

		this.validateBounds(graphInfo.bounds);

		// create the board for the graph
		const board = JSXGraph.initBoard(graphDiv, {boundingBox: graphInfo.bounds,
													maxBoundingBox: graphInfo.maxBoundingBox,
													drag: {enabled: graphInfo.drag},
													axis: graphInfo.axis,
													showNavigation: graphInfo.showNavigation,
													defaultAxes: graphInfo.defaultAxes,
													//@ts-ignore
													theme: 'obsidian',
													keepAspectRatio: graphInfo.keepAspectRatio});
		const graph: Graph = {
			board: board,
			createdElements: [],
			view3d: undefined
		}

		if (graphInfo.height) {
			graphDiv.style.height = graphInfo.height + "px";
		}
		if (graphInfo.width) {
			graphDiv.style.maxWidth = graphInfo.width + "px";
		}
		if (graphInfo.bounds3d != undefined) {
			this.validate3dBounds(graphInfo.bounds3d);

			const xLength = Math.abs(graphInfo.bounds[2]-graphInfo.bounds[0]);
			const yLength = Math.abs(graphInfo.bounds[1]-graphInfo.bounds[3]);
			const xMin = graphInfo.bounds[0] + xLength*0.15; 
			const yMin = graphInfo.bounds[3] + yLength*0.15; 

			const element: ElementInfo = {
				type: "view3d",
				def: [[xMin, yMin], [xLength-xLength*0.3, yLength-yLength*0.3], graphInfo.bounds3d],
				att: graphInfo.att3d
			}


			if (graphInfo.att3d == undefined) {
				graph.view3d = board.create("view3d", element.def);
			}
			else {
				this.checkComposedAtts(element.att as Att3d, graph.createdElements);
				//@ts-ignore
				graph.view3d = board.create(element.type, element.def, element.att);
			}
		}

		return graph;
	}

	private validateBounds(bounds: number[]) {
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

	private validate3dBounds(bounds: number[][]) {
		if (bounds.length != 3) {
			throw new SyntaxError("The amount of 3d bounds given is incorrect");
		}

		for (let i = 0; i < 3; i++) {
			if (bounds[i].length != 2) {
				throw new SyntaxError("The amount of 3d bounds given is incorrect");
			}
			if (bounds[i][0] >= bounds[i][1]) {
				throw new SyntaxError("The amount of 3d bounds given is incorrect");
			}
		}
	}

	addElement(graph: Graph, element: ElementInfo) {
		this.validateElement(element, graph.createdElements);
		let createdElement: GeometryElement;
		let createOn: Board | View3D = graph.board;

		if (element.type.contains("3d") ) {
			if (graph.view3d != undefined) {
				createOn = graph.view3d;
			}
			else {
				throw new SyntaxError("Have to set 3d bounds to use 3d elements");
			}
		}

		if (element.att == undefined) {
			//@ts-ignore
			createdElement = createOn.create(element.type, element.def);
		}
		else {
			//@ts-ignore
			createdElement = createOn.create(element.type, element.def, element.att);
		}
		graph.createdElements.push({name: element.type, element: createdElement});
	}

	private validateElement(element: ElementInfo, createdElements: JSXElement[]) {
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
		this.checkComposedAtts(element.att as Attributes, createdElements);
	}

	private validateDef(def: any[], createdElements: JSXElement[]) {
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

	private checkComposedElements(item: any, createdElements: JSXElement[]): number {
		const re  = new RegExp("^e[0-9]+$");
		// if it is a string and passes the regex test add the element to def
		if (typeof item === 'string' && re.test(item)) {
			const index = Number.parseInt(item.substring(1,item.length));

			// checks if it is a valid element
			if (index >= createdElements.length || index < 0) {
				throw new SyntaxError("Element has invalid composed element.");
			}

			return index;
		}
		return -1;
	}

	private checkComposedAtts(att: Attributes | Att3d, createdElements: JSXElement[]) {
		if (att != undefined) {
			for (const key of Object.keys(att)) {
				//@ts-ignore
				if (typeof att[key] === 'object') {
					//@ts-ignore
					this.checkComposedAtts(att[key], createdElements);
				}
			}
			this.validateAtt(att as Attributes, createdElements);
		}

	}

	private validateAtt(attribute: Attributes, createdElements: JSXElement[]) {
		// check attributes for elements
		if (attribute != undefined) {
			if (typeof attribute.anchor === 'string') {
				const index = this.checkComposedElements(attribute.anchor, createdElements);
				attribute.anchor = createdElements[index].element;
			}
			if (typeof attribute.fillColor === 'string') {
				attribute.fillColor = this.changeColorValue(attribute.fillColor);
			}
			if (typeof attribute.strokeColor === 'string') {
				attribute.strokeColor = this.changeColorValue(attribute.strokeColor);
			}
			if (typeof attribute.highlightFillColor === 'string') {
				attribute.highlightFillColor= this.changeColorValue(attribute.highlightFillColor);
			}
			if (typeof attribute.highlightStrokeColor === 'string') {
				attribute.highlightStrokeColor = this.changeColorValue(attribute.highlightStrokeColor);
			}
		}
	}

	private changeColorValue(value: string): string {
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

	private checkFunction(item: any, createdElements: JSXElement[]): any {
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
			return  new Function(...this.argsArray, "createdElements", "x", "y", "z", "return " + equation + ";").bind({}, ...this.mathFunctions, createdElements);
		}
		return item;
	}

	exportGraph(app: App, graph: Board) {
		const text = graph.renderer.dumpToDataURI();
		const ar = text.split(",");
		let  decoded =  decodeURIComponent(escape(atob(ar[1])));
		const re  = RegExp(/var\(\s*(--[\w-]+)\s*\)/g);
		let matches = re.exec(decoded);
		while (matches != null) {
				decoded = decoded.replace(matches[0], document.body.getCssPropertyValue(matches[1]));
				matches = re.exec(decoded);
		}

		app.vault.create("./test.svg", decoded);
	}
}

