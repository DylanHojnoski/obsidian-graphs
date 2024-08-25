Obsidian Graphs is controlled through using a code block with the "graph" language. It the takes YAML to create a graph and add elements to the graph. The underlying graphing library being used is JSXGraph so if there is something that you are looking for that is not in this documentation go to [JSXGraph Docs](https://jsxgraph.org/wp/docs/index.html). There are some features in the JSXGraph Docs that will not be possible with this plugin.

## Bounds

The bounds controls the initial size of the graph it is defined through four numbers in an array `[xmin, ymax, xmax, ymin]`

````
```graph
bounds: [-10, 10, 10, -10]
```
````

* [More ways to customize the board of the graph](Board)

## Elements

### Creating Elements

To create elements you need to make an elements array `elements: []`. Within that array you can make any of the following type of elements.

There are three fields to fill out

1. Type
	* `type: name`
	*  a string with the name of the element you are creating in all lower case and no spaces
2.  Definition 
	* `def: []`
	*  an array that contains the defining parameters of the element this can be a number, another element, an array of numbers, or a function
1. Attribute
	* `att: {}`
        * this is an optional field
	* an object that contains attributes which modify features of elements
		* name
		* inverse
		* chartStyle
		* fillColor
		* strokeColor
		* fillOpacity
		* [full list of attributes](Attributes)
		
#### Creating Functions

To make a function as a parameter you need to make a string such as `"f:"` after the f: you can put any kind of math that you want. You can use one variable `x`. While `x` may not always represent the actual x-axis you must always use `x` as the variable

Math Operators
* \+
	* addition
* \-
	* subtraction
*  \*
	* multiplication
* \
	* division

For more complex math functions use the [Javascript math functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math). __You do not need to put `Math.` before using a Math function__

Some examples:
* `PI`
* `abs()`
* `exp()`
* `sin()`
* `cos()`
* `pow()`

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: functiongraph, def: ["f:sin(x)"]}
]
```
````

![creatingFunctions](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/9fca2b76-633a-41b6-bba1-d2a2ae5a8264)

#### Composing Elements
Elements can be composed to make other elements if an elements takes a point or line as a parameter then you can give it an already existing one. The element given as a parameter has to be defined before where it is being used and is accessed by passing in the index number starting at 0 for the element as a string with an e before it `"e0"`.

For example a line requires two points to be created so we can create two points before the line and then pass in the points as parameters.

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: point, def: [1,1]},
	{type: point, def: [4,5]},
	{type: line, def: ["e0","e1"]}
]
```
````

![composing](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/b2342cef-347c-46ff-ac29-ffa113d296ca)

### 2D

#### Arrow 

Arrow creates an arrow on the graph it takes two points with the second point being where the arrow head is pointing `[[x,y], [x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: arrow, def: [[2,0], [-1,4]]}
]
```
````

![arrow](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/db4a3f91-3652-4e7b-9ddb-fe7ab6cbfd73)

#### Boxplot

Creates a boxplot which takes an array containing at least 5 quantiles and then a number for the axis position and a number for the width `[[quantiles], axis, width]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: boxplot, def: [[-1, 2, 3, 3.5, 5], 2, 4]}
]
```
````

![boxplot](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/41fa764d-c549-4458-ae93-e464d6c4cd98)

#### Chart

Chart creates different types of charts it takes in an array of data and in the att you need to set chartStyle which can be:
* bar
* fit
* line
* pie
* points
* radar
* spline

##### Bar

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [1,2,3,4], att: {chartStyle: "bar"}}
]
```
````

![chartBar](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/c609703f-4d21-4d4a-9d34-cd7c01be8bb3)

##### Fit

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [1,2,3,4], att: {chartStyle: "fit"}}
]
```
````

![chartFit](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/54e2841c-82c9-45fb-8008-e47cf69909c5)

##### Line

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [1,2,3,4], att: {chartStyle: "line"}}
]
```
````

![chartLine](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/b95d48df-753e-427d-82d4-6bedd16a051d)

##### Pie

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [1,2,3,4], att: {chartStyle: "pie"}}
]
```
````

![chartPie](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/4a66ebb2-0f11-4956-ba9f-5dcef718aa52)

##### Points

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [1,2,3,4], att: {chartStyle: "points"}}
]
```
````

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [1,2,3,4], att: {chartStyle: "points"}}
]
```
````

##### Radar

Radar needs a paramArray.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [[1,2,3],[4,3,2],[-5, -6, 0],[-1,5,1]], att: {chartStyle: "radar", paramArray: ["x", "y", "z"]}}
]
```
````

![chartRadar](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/a5007ddd-616c-4161-8964-383b8284beed)

##### Spline

Takes an array of x coordinates and an array of y coordinates

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: chart, def: [[1,2,3],[4,3,2]], att: {chartStyle: "spline"}}
]
```
````

![chartSpline](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/fd450285-8e6e-49ef-90dd-435579a152ce)

#### Circumcircle


Creates a circle that lies on three points. Takes three points as the parameters `[[x,y],[x,y],[x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: circumcircle, def: [[0,2], [2,1], [3,3]]}
]
```
````

![circumcircle](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/02b4d2b7-00ec-40ab-98ad-4be901ab9104)

#### Circle

Circle creates a circle at the given x,y point and then takes a radius `[[x,y], radius]`.

````
```graph
bounds: [-10, 10, 10, -10]
"keepAspectRation": true
elements: [
	{type: circle, def: [[0, 0],3]}
]
```
````

![circle](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/3b6062d0-92da-41b9-a77f-08c041f8b7eb)

#### Circumcenter

Creates a point at the midpoint of three points. Takes three points for the parameters `[[x,y],[x,y],[x,y]]`

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: circumcenter, def: [[0,2], [2,1], [3,3]]}
]
```
````

![circumcenter](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/03bfa18b-1da9-42f8-a667-c9cfe11ad2d3)

#### CircumcircleArc

Creates an arc that lies on three points. Takes three points as the parameters `[[x,y],[x,y],[x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: circumcirclearc, def: [[0,2], [2,1], [3,3]]}
]
```
````

![circumcircleArc](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/4aae0d63-5362-4f7b-bba3-e100b4445b7d)

#### Curve

Creates a curve which can make parametric curve, polar curves, or data plots. 

##### Parametric

The first parameter is a number or function that describes the x-coordinate. The second parameter is a number of function that describes the y-coordinate. The third and fourth parameter are optional and define the left and right interval borders for the curve.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: curve, def: ["f:x-Math.sin(x)", "f:1-Math.cos(x)", 0, "f:2*Math.PI"]}
]
```
````

![curveParametric](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/956d2075-cee3-4338-8096-41ad8d3bc5ab)

##### Polar

The first parameter is a function in terms of phi (use x as variable). The second parameter is the offset of the curve and has to be an array containing numbers. The third and fourth parameters describe the left and right interval border.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: curve, def: ["f:1-Math.cos(x)", [1,0], 0, "f:2*Math.PI"]}
]
```
````

![curvePolar](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/3a965adc-f691-4b45-bf1b-99b426386c9e)

##### Data Plots

The first parameter is an array of the x values and the second parameter is an array of the y values.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: curve, def: [[0,1,2,3,4,5,6,7,8,9],[9.2,1.3,7.2,-1.2,4.0,5.3,0.2,6.5,1.1,0.0]]}
]
```
````

![curveData](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/21e8d9ee-2312-4996-b48b-95b1be9d445a)

#### CurveDifference

Difference of two closed path elements. Takes two elements for parameters. You will also want to put a `fillColor` in the `att` which takes a string of a hex code or color name.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: functiongraph, def: ["f:Math.cos(x)"]},
	{type: inequality, def: ["e0"], att: {inverse:true, fillOpacity: 0.1}},
	{type: circle, def: [[0,0],4]},
	{type: curvedifference, def: ["e1", "e2"], att: {fillColor: "yellow", fillOpacity: 0.6}}
]
```
````

![curveDifference](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/2a597ddf-5bac-4da5-b9af-2cfe5476bc92)

#### CurveIntersection

Intersection of two closed path elements. Takes two elements for parameters. You will also want to put a `fillColor` in the `att` which takes a string of a hex code or color name.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: functiongraph, def: ["f:Math.cos(x)"]},
	{type: inequality, def: ["e0"], att: {inverse:true, fillOpacity: 0.1}},
	{type: circle, def: [[0,0],4]},
	{type: curveintersection, def: ["e1", "e2"], att: {fillColor: "yellow", fillOpacity: 0.6}}
]
```
````

![curveIntersection](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/51f6c91e-f62b-422a-8183-7b7ac452b432)

#### CurveUnion

Union of two closed path elements. Takes two elements for parameters. You will also want to put a `fillColor` in the `att` which takes a string of a hex code or color name.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: functiongraph, def: ["f:Math.cos(x)"]},
	{type: inequality, def: ["e0"], att: {inverse:true, fillOpacity: 0.1}},
	{type: circle, def: [[0,0],4]},
	{type: curveunion, def: ["e1", "e2"], att: {fillColor: "yellow", fillOpacity: 0.6}}
]
```
````

![curveUnion](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/1a6c67a7-e8a0-4b59-ac0f-a7a73d289f60)

#### Ellipse

Ellipse creates an ellipse which takes two x,y points and a number for the length of the major axis `[[x,y], [x,y], length]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: ellipse, def: [[0,0], [5,0], 20]}
]
```
````

![ellipse](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/7c411c64-f47f-4299-a90b-a529ea0d2917)

#### Functiongraph

Function creates an element based on a function that has the x as it parameter. The second parameter is a number that gives the start of the bounds and the third parameter is a number that gives the end of the bounds. `["f:", start, end]`

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: functiongraph, def: ["f:Math.sin(x)"]}
]
```
````

![functiongraph](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/8a5753cb-360f-4d14-8a19-97be2418f5ae)

#### Glider

Creates a glider which lives on another element and moves along its path. Takes a element as a parameter `["e0"]`

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: circle, def: [[0,2], 2]},
	{type: glider, def: ["e0"]}
]
```
````

![glider](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/65737a46-d361-4370-9bed-e33400138a71)

#### ImplicitCurve

Creates an implicit curve from an implicit equation with two independent variables (x,y). It takes a function as a parameter with x and y as the variables. `["f:"]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: implicitcurve, def: ["f:1/16*x**2+y**2-1"]},
]
```
````

![implcitcurve](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/163dde92-3446-4377-b486-26f95e6be6d8)

#### Incenter

Creates the incenter of a triangle from the three points taken as parameters `[[x,y],[x,y],[x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: incenter, def: [[0,2],[2,1], [3,4]]}
]
```
````

![incenter](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/2f9e3a44-37dd-4f8e-a568-0737b3ad388d)

#### Inequality

Inequalities can be displayed by creating an element and passing it into the inequality element as a parameter. The default is less than or equal to. To make it greater than or equal to in `att` set `"inverse": true`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: line, def: [[1,1],[0,0]]},
	{type: inequality, def: ["e0"]}
]
```
````

![inequality](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/bb021303-70ef-46a3-8126-d03f88714871)

#### Integral

Creates an integral of an existing function on the graph. Takes in an array for the min and max range of the integral and then the element that contains the function graph `[[-2.0, 2.0], "e0"]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: functiongraph, def: ["f:2*x"]},
	{type: integral, def: [[-2,2], "e0"]}
]
```
````

![integral](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/8387f51b-d9e7-48f1-aeac-90a32f55df5d)

#### Intersection

Intersection displays a point where to graph elements intersect. It takes in two elements as parameters to use `["e", "e"]`. 

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: line, def: [[0, 0],[1,1]]},
	{type: line, def: [[-2,0],[1, -4]]},
	{type: intersection, def: ["e0", "e1"]}
]
```
````

![intersection](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/6ae40847-4045-4b41-aa76-fec0273c3565)

#### Line

Lines are created by defining a line with two points. It takes two points as parameters `[[x,y], [x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: line, def: [[0,0],[4,1]]}
]
```
````

![line](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/4e3d8e98-a152-42bf-9a42-97b8ea73af92)

#### Parabola

Parabola creates a parabola on the graph and takes a point for the focus and a line for the directrix `[[x,y], [[x,y],[x,y]]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: parabola, def: [[2,0], [[-1,4],[-1,-4]]]}
]
```
````

![parabola](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/e47e815d-b15b-4136-bc08-be5580d64484)

#### Parallel

Creates a line parallel to a line and goes through a point. Takes in a line for the first parameter and a point for the second `["e", [x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: line, def: [[1,2],[2,4]]},
	{type: parallel, def: ["e0",[5,5]]}
]
```
````

![parallel](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/69f1e2d3-64d1-4397-a73c-9e0e106f383f)

#### Perpendicular

Creates a line that is perpendicular to a line and goes through a point. Takes in a line for the first parameter which can be defined there or an existing element and then a point which can be defined or an existing element `["e", [x,y]]`. 

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: line, def: [[1,2],[2,4]]},
	{type: perpendicular, def: ["e0",[5,5]]}
]
```
````

![perpendicular](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/6d0d31eb-8ae4-4640-b46a-edb2d9fe9836)

#### Point

Points are put onto the graph with an x and y definition `[x,y]`.

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: point, def: [1,1]}
]
```
````

![point](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/7dc12ecb-b438-4dad-bb36-4389058a5613)

#### Polygon

Polygon creates a polygon on the graph it takes in as many points as you give it `[[x,y], [x,y], ...]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: polygon, def: [[2,0], [-1,4], [3,4]]}
]
```
````

![polygon](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/3229212f-97d2-4995-8988-b675c1bc1039)

#### Polygonalchain

Creates connected series of lines from an array of points `[[x,y],[x,y],...]`

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: polygonalchain, def: [[0,2],[2,1], [3,4]]}
]
```
````

![polygonalchain](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/4c1d86c2-68ba-4a4f-a580-552309f9fe7e)

#### RegularPolygon

Creates a regular polygon which takes two points the defines the baseline and a number defines the number of vertices `[[x,y],[x,y], vertices]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: regularpolygon, def: [[0,2],[2,1], 5]}
]
```
````

![regularPolygon](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/4f156743-7a3f-4c56-821c-19612890b77c)

#### Riemannsum

Creates a riemannsum for a function that is given. The first parameter is a function, the second one is how many boxes to draw, the third one is a string of the type of riemannsum `["f:", #ofBoxes, "type"]`.

Types
* left
* right
* middle
* lower
* upper
* random
* simpson
* trapezoidal

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: riemannsum, def: ["f:x", 10, "upper"]}
]
```
````

![riemannsum](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/35d3e1de-0b67-4365-931f-0dad395d4520)

#### Sector

Creates a sector based on three points. Takes three points as parameter `[[x,y],[x,y],[x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: sector, def: [[0,2],[1,4],[4,-4]]}
]
```
````

![sector](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/ee5cf892-5f46-4adc-bc51-70cb54fad319)

#### Segment

Creates a segment which is a line with two end points. Takes two points as parameters and also has a third optional fixed length parameter which is a number `[[x,y],[x,y], length]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: segment, def: [[0,0],[4,5]]}
]
```
````

![segment](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/7f3d24ce-125f-455f-836d-a60c8212c3c0)

#### Semicircle

Semicircle creates a semicircle which takes two points and makes and ark between them `[[x,y], [x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: semicircle, def: [[0, 0],[6,0]]}
]
```
````

![semicircle](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/f7c5116d-54e5-433d-889d-844a7b2c17b2)

#### Slider

Creates a slider that you can use to change values of elements. It takes two points for where to put the slider and then an array that holds the range of the slider and the starting point `[[x,y],[x,y],[min,start,max]]`

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: slider, def: [[1,2],[3,2],[1,5,10]]}
]
```
````

![slider](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/33b89c72-c47d-4f8c-ba5d-687ee20c26e1)

#### Slopefield

Creates a slope field which takes in a function and a xData and yData array. The arrays contain the start, steps, and end values `["f:", [xStart, xSteps, xEnd], [yStart, ySteps, yEnd]]`.

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: slopefield, def: ["f:x*x-x-2", [-6,25,6], [-5,20,5]]}
]
```
````

![slopeField](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/c7b85a14-89da-41a7-9c5a-724fd5cdf3f1)

#### Slopetriangle

Creates slope triangle which displays the slope based on a point on a line. The parameter are a line and a glider which can be passed in through composing elements `["eLine", "eGlider"]`. You can also pass in a tangent as a parameter `["eTangent"]`.

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: line, def: [[0,0],[2,5]]},
	{type: glider, def: [0,0, "e0"]},
	{type: slopetriangle, def: ["e0", "e1"]}
]
```
````

![slopeTriangle1](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/01cf7ef8-1f16-4120-a6db-a45ae8fd5e57)

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: functiongraph, def: ["f:sin(x)"]},
	{type: glider, def: [0,0, "e0"]},
	{type: tangent, def: ["e1"]},
	{type: slopetriangle, def: ["e2"]}
]
```
````

![slopeTriangle2](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/5cbf9421-27a4-4d75-aeda-1ed3e91b23c0)

#### Stepfunction

Creates a step function which takes two arrays the first one for x values and the second for y values `[[x values], [y values]]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: stepfunction, def: [[0,1,2,3,4,5], [1,3,0,2,2,1]]}
]
```
````

![stepfunction](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/ca9cc81d-ef29-461a-87f4-7a95639f1ca1)

#### Tangent

Creates a tangent line based on where a glider is on an element. Takes a glider as a parameter `["e"]`.

````
```graph
bounds: [-10, 10, 10, -10]
keepAspectRatio: true
elements: [
	{type: circle, def: [[0,2], 2]},
	{type: glider, def: ["e0"]},
	{type: tangent, def: ["e1"]}
]
```
````

![tangent](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/0bc094be-b8b4-49d7-920c-94eb98922c81)

#### Tape Measure

Creates a tape measure that can be used to measure the distance between points. Takes two points which are the starting position as parameters `[[x,y],[x,y]]`.

````
```graph
bounds: [-10, 10, 10, -10]
elements: [
	{type: tapemeasure, def: [[0,2], [2,1]]},
	{type: point, def: [2,2]},
	{type: point, def: [4,1]}
]
```
````

![tapemeasure](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/d7f93974-9d7f-46af-a0cf-997a585806f7)

#### Text
Create a text object. Takes an x and y position as parameters and a string [x,y, "string"]. You can anchor a text object to another element by putting `anchor: "e"` in the `att`.

You can use LaTeX in your text by wrapping text in `$` to do inline math. To use LaTeX commands you also need to use two back slashes instead of one for example `"$\\vec{v}$"`.

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: point, def: [0,1]},
	{type: text, def: [1,1, "Hello"], att: {anchor: "e0"}}
]
```
````

![text](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/3c0ce809-886a-4351-a4ed-ae32438cc9aa)

#### Vectorfield

Create a vector field that takes in an array of two functions and then an xData and yData array. These arrays contain three values start, steps, and end `[["f:","f:"], [xStart, xSteps, xEnd], [yStart, ySteps, yEnd]]`

````
```graph
bounds: [-10,10,10,-10]
elements: [
	{type: vectorfield, def: [["f:sin(y)", "f:cos(x)"], [-6, 25, 6], [-5,20,5]]}
]
```
````

![vectorField](https://github.com/DylanHojnoski/obsidian-graphs/assets/68570349/deeccf45-6cf2-429a-abe4-c343c0f00de5)

### 3D

#### Setup

To make a 3D graph you need to set the `bounds3D` graph variable which is an array which takes an upper and lower value for the x, y, and z value. For example `[[xMin, xMax], [yMin, yMax], [zMin, zMax]]`. I would also recommend setting `axis: false` and `keepAspectRatio: true`.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
```
````

![screenshot-2024-08-14-19-29-01](https://github.com/user-attachments/assets/6e42df7f-3860-429e-ae79-13465e3a66fa)

You can then add 2D elements to the board and then also 3D elements the same as you would 2D.

#### Circle3D

Circle3D creates a circle on the 3D graph which takes an point 3D for the center `[x,y,z]` then it takes an array with three numbers for the normal `[num, num, num]` lastly it takes a number for the radius of the circle

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: circle3d, def: [[1,1,1], [1,1,1], 3]}
]
```
````

![screenshot-2024-08-14-19-29-14](https://github.com/user-attachments/assets/31638005-91a7-467e-9468-362f2bdde61f)

#### Curve3D

Curve3D creates a curve on the 3D board it takes three functions for x, y, and z coordinate and then the an array for the range of the curve. for example `["f:", "f:", "f:". [num, num]]` for variables in the functions only use __x__ even thought in the second it will be for __y__ and the third function it will be for __z__.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: curve3d, def: ["f:x", "f:-x", "f:x", [0, 5]]}
]
```
````

![screenshot-2024-08-14-19-29-53](https://github.com/user-attachments/assets/13ae02a5-ce16-4b91-8724-135222ac7af3)

#### Functiongraph3D

Functiongraph3D creates a function on the 3D board it takes a function as the first parameter and then an array for the range of X and then an array for the range of Y. For example `["f:", [xMin, xMax], [yMin, yMax]]` can use both x and y as variables in the function.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: functiongraph3d, def: ["f:sin(x*y/4)", [-5, 5], [-5, 5]]}
]
```
````

![screenshot-2024-08-14-19-30-07](https://github.com/user-attachments/assets/f0721305-b444-4aac-b4f6-0b30a74d9738)

#### Line3D

Line3D creates a line on the 3D board which takes two 3D points for the parameters. For example `[[x1, y1, z2], [x2, y2, z2]]`.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: line3d, def: [[0,0,0], [4,4,5]]}
]
```
````

![screenshot-2024-08-14-19-30-21](https://github.com/user-attachments/assets/17a944ec-e8d5-4552-ab04-3bbdcbe17baf)

#### ParametricSurface3D

ParametricSurface3D creates a parametric surface on the 3D board which takes three function for the x, y, and z axes and then two arrays of length two the first being the range of u and the second being the range of v.  For example `["f:". "f:". "f:", [min, max], [min, max]]` in the functions use __x__ as u and __y__ as v.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: parametricsurface3d, def: ["f:(2+cos(x))*cos(y)" , "f:(2+cos(x))*sin(y)", "f:sin(x)", [-5, "f:2*PI"], [-5, "f:PI"]]},
]
```
````

![screenshot-2024-08-14-19-30-33](https://github.com/user-attachments/assets/b1e5fe7e-fb74-476b-a04f-2f7a19dc63d0)

#### Plane3D

Plane3D creates a plane on the 3D board it takes a starting 3D point and then takes two vectors of length 3 for the directions of the plane. For example `[[x, y, z], [x, y, z], [x, y, z]]`.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: plane3d, def: [[1,-1,1], [0,1,0], [2,1,1]], att: {fillColor: "purple"}}
]
```
````

![screenshot-2024-08-14-19-30-44](https://github.com/user-attachments/assets/55a67835-e48e-4fb7-878c-ce7cdbb74db6)

#### Point3D

Point3D creates a point on the 3D board it takes an x, y, and z value for parameters. For example `[x, y, z]`.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: point3d, def: [1,1,1]}
]
```
````

![screenshot-2024-08-14-19-30-57](https://github.com/user-attachments/assets/5f97deb7-dbe5-4c3b-b3d4-11364df009bf)

#### Polygon3D

Polygon3D creates a polygon on the 3D board it takes an array of 3D points. For example `[[x1,y1,z1],[x2,y2,z2]]`.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: polygon3d, def: [[3,3,0],[1,1,1],[-1,-1,-1]]}
]
```
````

![screenshot-2024-08-14-19-31-11](https://github.com/user-attachments/assets/2d3b62e9-9387-4ada-acd4-d8a7c0c8fd8b)

#### Sphere3D

Sphere3D creates a sphere on the 3D board it takes a point 3D as the first parameter and then a number for the radius. For example `[[x,y,z], radius]`.

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepAspectRatio: true
elements: [
	{type: sphere3d, def: [[0,0,0], 2]},
]
```
````

![screenshot-2024-08-14-19-31-25](https://github.com/user-attachments/assets/a99947d3-4714-42dd-b160-613b4a19ad1c)

#### Vectorfield3D

Vectorfield3D creates a vectorfield on the 3D board it takes an array of three functions for the x, y, and z axes and then takes three arrays of length three which describe the start value, number of steps, and the end value of the x, y, and z axes. For example `[["f:x", "f:y", "f:z"], [xStart, xSteps, xEnd], [yStart, ySteps, yEnd], [zStart, zSteps, zEnd]]`. 

````
```graph
bounds: [-10, 10, 10, -10]
bounds3d: [[-5,5],[-5,5],[-5,5]]
axis: false
keepaspectratio: true
elements: [
	{type: vectorfield3d, def: [["f:sin(x)", "f:sin(y)", "f:sin(z)"], [-5, 5, 5], [-5, 5, 5], [-5, 5, 5]]}
]
```
````

![screenshot-2024-08-14-19-31-37](https://github.com/user-attachments/assets/64c158a4-ed4f-483c-b946-5ba860a7e7d9)
