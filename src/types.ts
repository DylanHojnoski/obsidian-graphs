
export interface GraphInfo {
	bounds: number[],
	keepAspectRatio: boolean,
	showNavigation: boolean,
	elements: ElementInfo[],
}

export interface ElementInfo {
	type: string,
	def: any[],
	att: Attributes,
}

export interface Attributes {
	name: string,
	inverse: boolean,
	chartStyle: string,
	paramArray: string,
	fillColor: string,
	strokeColor: string,
	fillOpacity: number,
	anchor: string,
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
	Semicircle = "Semicircle",
	Slider = "slider",
	Stepfunction = "stepfunction",
	Tangent = "tangent",
	Tapemeasure = "tapemeasure",
	Text = "text",
}
