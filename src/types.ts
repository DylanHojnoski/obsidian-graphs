import { Board, GeometryElement, View3D } from "jsxgraph";

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
	bounds3d: [
		[ x1: number, y1: number ],
		[ x2: number, y2: number ],
		[ x3: number, y3: number ],
	] | undefined,
	att3d: Att3d | undefined,
}
	export interface Att3d {
		axisPosition: string,
		projection: string,

		xAxis: Attributes ,
		xPlaneFront: Attributes,
		xPlaneFrontYAxis: Attributes,
		xPlaneFrontZAxis: Attributes,
		xPlaneRear: Attributes,
		xPlaneRearYAxis: Attributes,
		xPlaneRearZAxis: Attributes,

		yAxis: Attributes,
		yPlaneFront: Attributes,  
		yPlaneFrontXAxis: Attributes,
		yPlaneFrontZAxis: Attributes,
		yPlaneRear: Attributes,
		yPlaneRearXAxis: Attributes,
		yPlaneRearZAxis: Attributes,

		zAxis: Attributes,
		zPlaneFront: Attributes,
		zPlaneFrontXAxis: Attributes,
		zPlaneFrontYAxis: Attributes,
		zPlaneRear: Attributes,
		zPlaneRearXAxis: Attributes,
		zPlaneRearYAxis: Attributes,
	}

export interface Graph {
	board: Board,
	createdElements: JSXElement[],
	view3d: View3D | undefined
}

export interface ElementInfo {
	type: string,
	def: any[],
	att: Attributes | Att3d | undefined,
}

export interface Attributes {
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
	Circle3D = "circle3d",
	Circle = "circle",
	Circumcenter = "circumcenter",
	CircumcircleArc = "circumcirclearc",
	Curve3D = "curve3d",
	Curve = "curve",
	CurveDifference  = "curvedifference",
	CurveIntersection = "curveintersection",
	CurveUnion = "curveunion",
	Derivaative = "derivative",
	Ellipse = "ellipse",
	Function3D = "functiongraph3d",
	Function = "functiongraph",
	Glider = "glider",
	Incenter = "incenter",
	Inequality = "inequality",
	Integral = "integral",
	IntersectionCircle3D = "intersectioncircle3d",
	Intersection = "intersection",
	IntersectionLine3D = "intersectionline3d",
	Label = "label",
	Line3D = "line3d",
	Line = "line",
	Parabola = "parabola",
	Parallel = "parallel",
	ParametricSurface3D = "parametricsurface3d",
	Perpendicular = "perpendicular",
	Plane3D = "plane3d",
	Point3D = "point3d",
	Point = "point",
	Polygon3D = "polygon3d",
	PolygonalChain = "polygonalchain",
	Polygon = "polygon",
	RegularPolygon = "regularpolygon",
	Riemannsum = "riemannsum",
	Sector = "sector",
	Segment = "segment",
	Semicircle = "Semicircle",
	Slider = "slider",
	SlopeField = "slopefield",
	SlopeTriangle = "slopetriangle",
	Sphere3D = "sphere3d",
	Stepfunction = "stepfunction",
	Tangent = "tangent",
	Tapemeasure = "tapemeasure",
	Text = "text",
	Vectorfield3D = "vectorfield3d",
	VectorField = "vectorfield",
}
