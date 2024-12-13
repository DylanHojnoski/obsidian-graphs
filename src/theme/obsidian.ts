// Constants for this theme:
const interactiveAccent = "var(--interactive-accent)",
	interactiveAccentHover = "var(--interactive-accent-hover)",
	textNormal = "var(--text-normal)",
	textMuted = "var(--text-muted)";

// @ts-ignore
JXG.themes['obsidian'] = {

	board: {
		showInfobox: true,
		showCopyright: false,
		browserPan: true,
		pan: {needTwoFingers: true},
	},

	navbar: {
		strokeColor: textMuted,
	},

	elements: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
	},

	view3d: {
		xAxis: {
			strokeColor: "var(--color-orange)",
		},
		yAxis: {
			strokeColor: "var(--color-green)",
		},
		zAxis: {
			strokeColor: "var(--color-blue)",
		},
		xPlaneRear: {
			fillColor: "var(--color-base-00)",
			gradient: "linear",
			gradientSecondColor: "var(--color-base-50)",
		},
		xPlaneFront: {
			fillColor: "var(--color-base-00)",
			gradient: "linear",
			gradientSecondColor: "var(--color-base-50)",
		},
		yPlaneRear: {
			fillColor: "var(--color-base-00)",
			gradient: "linear",
			gradientSecondColor: "var(--color-base-50)",
		},
		yPlaneFront: {
			fillColor: "var(--color-base-00)",
			gradient: "linear",
			gradientSecondColor: "var(--color-base-50)",
		},
		zPlaneRear: {
			fillColor: "var(--color-base-00)",
			gradient: "linear",
			gradientSecondColor: "var(--color-base-50)",
		},
		zPlaneFront: {
			fillColor: "var(--color-base-00)",
			gradient: "linear",
			gradientSecondColor: "var(--color-base-50)",
		},
		xPlaneFrontYAxis: {
			strokeColor: textNormal,
		},
		xPlaneFrontZAxis: {
			strokeColor: textNormal,
		},
		yPlaneFrontXAxis: {
			strokeColor: textNormal,
		},
		yPlaneFrontZAxis: {
			strokeColor: textNormal,
		},
		zPlaneFrontXAxis: {
			strokeColor: textNormal,
		},
		zPlaneFrontYAxis: {
			strokeColor: textNormal,
		},

		xPlaneRearYAxis: {
			strokeColor: textNormal,
		}, 
		xPlaneRearZAxis:  {
			strokeColor: textNormal,
		},
		yPlaneRearXAxis:  {
			strokeColor: textNormal,
		},
		yPlaneRearZAxis:  {
			strokeColor: textNormal,
		},
		zPlaneRearXAxis: {
			strokeColor: textNormal,
		},
		zPlaneRearYAxis: {
			strokeColor: textNormal,
		},
	},

	mesh3d: {
		strokeColor: textNormal,
		fillColor: textNormal,
	},

	axis3d: {
		strokeColor: textNormal,
	},

	point3d: {
		fillColor: interactiveAccent,
		strokeColor: interactiveAccent,
	},

	line3d: {
		strokeColor: interactiveAccent,
	},

	plane3d: {
		fillColor: interactiveAccent
	},

	sphere3d: {
		fillColor: interactiveAccent,
		strokeColor: interactiveAccent,
		gradient: 'radial',
		gradientSecondColor: interactiveAccent,
		gradientFX: 0.7,
		gradientFY: 0.3,
		fillOpacity: 0.4
	},

	ellipse: {
		strokeColor: interactiveAccent,
		fillColor: interactiveAccent,
	},


	angle: {
		strokeColor: interactiveAccent,
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
		label: {
			strokeColor: textNormal 
		}
	},

	arc: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
	},

	axis: {
		strokeColor: textNormal,
		highlightStrokeColor: textMuted,
		ticks: {
			strokeColor: textNormal,
			highlightStrokeColor: textMuted,
			label: {
				useMathJax: false,
			}
		},
		label: {
			strokeColor: textNormal,
			highlightStrokeColor: textMuted,
		}
	},

	boxplot: {
		strokeColor: interactiveAccent,
		fillColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
		highlightFillColor: interactiveAccentHover,
	},

	circle: {
		strokeColor: interactiveAccent,
		highlightFillColor: 'none',
		highlightStrokeColor: interactiveAccentHover,
		center: {
			fillColor: interactiveAccent,
			strokeColor: interactiveAccent,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: interactiveAccentHover
		},
		point2: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted 
		}
	},

	circumcircle: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
		center: {
			fillColor: interactiveAccent,
			strokeColor: interactiveAccent,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: interactiveAccentHover
		}
	},

	circumcirclearc: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
	},

	circumcirclesector: {
		strokeColor: interactiveAccent,
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
	},

	comb: {
		strokeColor: interactiveAccent,
	},

	conic: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
		fillColor: 'none',
		highlightFillColor: 'none'
	},

	curve: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
	},

	grid: {
		strokeColor: textMuted,
		highlightStrokeColor: textMuted,
	},

	hatch: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
	},

	incircle: {
		highlightFillColor: 'none',
		highlightStrokeColor: interactiveAccentHover,
		center: {
			fillColor: interactiveAccent,
			strokeColor: interactiveAccent,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: interactiveAccentHover
		}
	},

	inequality: {
		fillColor: interactiveAccent,
	},

	label: {
		strokeColor: textNormal,
		highlightStrokeColor: textMuted,
		useMathJax: true,
		display: "html",
		parse: false,
	},

	line: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
		point1: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted 
		},
		point2: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted
		}
	},

	normal: {
		strokeColor: interactiveAccent
	},

	parallel: {
		strokeColor: interactiveAccent
	},

	perpendicular: {
		strokeColor: interactiveAccent
	},

	perpendicularsegment: {
		strokeColor: interactiveAccent
	},

	point: {
		fillColor: interactiveAccent,
		strokeColor: textNormal,
		highlightFillColor: interactiveAccentHover,
		highlightStrokeColor: textMuted,
		showInfobox: true,
	},

	polygon: {
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
		vertices: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted
		},
		borders: {
			strokeColor: interactiveAccent,
			highlightStrokeColor: interactiveAccentHover,
		}
	},

	regularpolygon: {
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
		vertices: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted
		},
		borders: {
			strokeColor: interactiveAccent,
			highlightStrokeColor: interactiveAccentHover,
		}
	},

	riemannsum: {
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
	},

	sector: {
		strokeColor: interactiveAccent,
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
	},

	semicircle: {
		center: {
			fillColor: interactiveAccent,
			strokeColor: interactiveAccent,
			highlightStrokeColor: interactiveAccentHover
		}
	},

	slider: {
		fillColor: interactiveAccent,
		strokeColor: textNormal,
		highlightFillColor: interactiveAccentHover,
		highlightStrokeColor: textMuted,
		baseline: {
			strokeColor: textNormal,
			fillColor: textNormal,
			highlightStrokeColor:textMuted,
			highlightFillColor: textMuted,
		},
		label: {
			strokeColor: textNormal,
			fillColor: textNormal,
			highlightStrokeColor: textMuted,
			highlightFillColor: textMuted,
		},
		highline: {
			strokeColor: textNormal,
			fillColor: textNormal,
			highlightStrokeColor: textMuted ,
			highlightFillColor: textMuted,
		},
		ticks: {
			strokeColor: textNormal,
			fillColor: textNormal,
			highlightStrokeColor: textMuted ,
			highlightFillColor: textMuted,
		}
	},

	slopefield: {
		highlightStrokeColor: interactiveAccentHover,
	},

	tapemeasure: {
		strokeColor: interactiveAccent,
		highlightStrokeColor: interactiveAccentHover,
		point1: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted 
		},
		point2: {
			fillColor: interactiveAccent,
			strokeColor: textNormal,
			highlightFillColor: interactiveAccentHover,
			highlightStrokeColor: textMuted 
		},
		ticks: {
			strokeColor: interactiveAccent,
			highlightStrokeColor: interactiveAccentHover,
		}
	},

	text: {
		strokeColor: textNormal,
		highlightStrokeColor: textMuted,
		useMathJax: true,
		display: "html",
		parse: false,
	},

	tracecurve: {
		strokeColor: interactiveAccent
	},

	turtle: {
		strokeColor: interactiveAccent,
		arrow: {
			strokeColor: interactiveAccent
		}
	},

	integral: {
		color: interactiveAccent,
		strokeColor: interactiveAccent,
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
		highlightStrokeColor: interactiveAccentHover,
		curveLeft: {
			color: interactiveAccent,
		},
		curveRight: {
			color: interactiveAccent,
		},
		baseLeft: {
			color: interactiveAccent,
		},
		baseRight: {
			color: interactiveAccent,
		},
	},

	vectorfield: {
		highlightStrokeColor: interactiveAccentHover,
	},

	slopetriangle: {
		fillColor: interactiveAccent,
		highlightFillColor: interactiveAccentHover,
	}
};

export default JXG;
