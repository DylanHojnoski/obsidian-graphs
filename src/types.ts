import { GeometryElement } from "jsxgraph";

export interface JSXElement {
	name: string,
	element: GeometryElement
}

export interface GraphInfo {
	bounds: [
		x1: number,
		y1: number,
		x2: number,
		y2: number
	],
	maxBoundingBox: [
		x1: number | null,
		y1: number | null,
		x2: number | null,
		y2: number | null
	] | undefined,
	keepAspectRatio: boolean,
	showNavigation: boolean,
	axis: boolean,
	defaultAxes: any,
	drag: boolean,
	elements: ElementInfo[],
	// plugin specific settings
	height: number | undefined,
	width: number | undefined,
}

export interface ElementInfo {
	type: string,
	def: any[],
	att: Attributes,
}

export type  Attributes = {
	name: string,
	inverse: boolean,
	chartStyle: string,
	paramArray: string,
	fillColor: string,
	highlightFillColor: string,
	strokeColor: string,
	highlightStrokeColor: string,
	fillOpacity: number,
	anchor: string | GeometryElement,
	useMathJax: boolean,
}

export type Axis = {
	x: any,
	y: any,
}

export enum Types {
	Arrow = "arrow",
	Boxplot = "boxplot",
	Chart = "chart",
	Cicumcircle = "circumcircle",
	Circle = "circle",
	Circumcenter = "circumcenter",
	CircumcircleArc = "circumcirclearc",
	Curve = "curve",
	CurveDifference  = "curvedifference",
	CurveIntersection = "curveintersection",
	CurveUnion = "curveunion",
	Derivaative = "derivative",
	Ellipse = "ellipse",
	Function = "functiongraph",
	Glider = "glider",
	Incenter = "incenter",
	Inequality = "inequality",
	Integral = "integral",
	Intersection = "intersection",
	Label = "label",
	Line = "line",
	Parabola = "parabola",
	Parallel = "parallel",
	Perpendicular = "perpendicular",
	Point = "point",
	Polygon = "polygon",
	PolygonalChain = "polygonalchain",
	RegularPolygon = "regularpolygon",
	Riemannsum = "riemannsum",
	Sector = "sector",
	Segment = "segment",
	Semicircle = "Semicircle",
	Slider = "slider",
	SlopeField = "slopefield",
	SlopeTriangle = "slopetriangle",
	Stepfunction = "stepfunction",
	Tangent = "tangent",
	Tapemeasure = "tapemeasure",
	Text = "text",
	VectorField = "vectorfield",
}
