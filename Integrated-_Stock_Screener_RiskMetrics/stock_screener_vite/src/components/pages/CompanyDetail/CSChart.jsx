import * as d3 from 'd3'
import { zoom, zoomIdentity } from 'd3';
import logo from '../../../assets/numeraxial-logo2.png';

const MARGIN = { TOP: 10, BOTTOM: 80, LEFT: 70, RIGHT: 10 };
const WIDTH = 888 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;


class CSChart {
	constructor(element, data, stock, mode) {

		const candle_width = ((WIDTH) / (data.length)) / 2;

		// console.log(new Date(data[data.length-1]['Date']));
		// console.log(parseFloat(data[data.length-1]['Adj Close']));
		// console.log(parseFloat(data[data.length-1]['High']));
		// console.log(parseFloat(data[data.length-1]['Low']));
		// console.log(data.map(d => new Date(d.Date)))

		// console.log('CSChart initial data:', data);


		let vis = this
		vis.g = d3.select(element)
			.append("svg")
			.attr("class", "chart-display")
			.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
			.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
			.append("g")
			.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

		// Append Logo to background
		vis.g.append('svg:image')
			.attr('xlink:href', logo)
			.attr('width', WIDTH)
			.attr('height', HEIGHT)
			.attr('x', 0)
			.attr('y', 0)
			.style('opacity', '.06')


		vis.x = d3.scaleTime().range(d3.range(0, WIDTH, WIDTH / data.length));

		vis.y = d3.scaleLinear()
			.range([HEIGHT, 0])

		vis.xAxisGroup = vis.g.append("g")
			.attr("transform", `translate(0, ${HEIGHT})`)
		vis.yAxisGroup = vis.g.append("g")

		vis.g.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 40)
			.attr("font-size", 20)
			.attr("text-anchor", "middle")
			.text("Date")



		vis.update(element, data, stock)


	}

	//Method to Adjust X-axis
	timePeriodChecker(data) {
		let vis = this
		//Tick Values for a Week
		if (data.length <= 5) {
			return (d3.axisBottom(vis.x).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeDay.every())).tickValues(data.map(d => new Date(d.Date)));
		}
		//Tick Values for a Month
		else if ((data.length > 5) && (data.length <= 25)) {
			return (d3.axisBottom(vis.x).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeMonday.every(1)));
		}
		//Tick Values for 3 Months
		else if ((data.length > 25) && (data.length <= 75)) {
			return (d3.axisBottom(vis.x).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeMonday.every(3)));
		}
		//Tick Values for 1 Year
		else if ((data.length > 75) && (data.length <= 255)) {
			return (d3.axisBottom(vis.x).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeMonth.every(2)));
		}
		//Tick Values for 5 Years
		else if ((data.length > 255) && (data.length <= 1275)) {
			return (d3.axisBottom(vis.x).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeYear.every(1)));
		}

	}

	// Call when data changes
	update(element, data, stock, mode) {

		let vis = this
		vis.mode = mode
		vis.data = data
		vis.stock = stock
		vis.element = element

		// console.log(d3.range(0, WIDTH, WIDTH/data.length))
		// console.log([data[0]["Date"], data[data.length-1]["Date"]])

		vis.x = d3.scaleTime().range(d3.range(0, WIDTH, WIDTH / data.length)).domain([data[0]["Date"], data[data.length - 1]["Date"]]);

		vis.y = d3.scaleLinear()
			.range([HEIGHT, 0])

		vis.yScaling = vis.y
		vis.xScaling = vis.x

		const xlabel = vis.g
			.selectAll(".xlabel")
			.data(data)
			.attr("x", -(HEIGHT / 2))
			.attr("y", -50)
			.attr("transform", "rotate(-90)");


		xlabel.exit()
			.transition(1000)
			.remove()

		xlabel.transition(1000)
			.text(`(${stock}) Price`)
			.attr("class", "xlabel")
			.attr("font-size", 20)
			.attr("text-anchor", "middle");

		xlabel.enter().append("text")
			.text(`(${stock}) Price`)
			.attr("class", "xlabel");


		var candle_width = ((WIDTH) / (data.length)) / 1.5

		var xScale = vis.x.domain(data.map(d => new Date(d.Date)));
		var yScale = vis.y.domain([d3.min(data, d => { return parseFloat(d['Adjusted_Low']) }) * 0.9, d3.max(data, d => { return parseFloat(d['Adjusted_High']) }) * 1.1]);

		var xAxisCall = this.timePeriodChecker(data)

		if (mode < 2) {
			xAxisCall = (d3.axisBottom(vis.x).tickFormat(d3.timeFormat('%d %b %I:%M %p')).tickValues(data.map(d => new Date(d.Date)).filter(function (_, i) { return (i + 1) % 2; }).filter(function (_, i) { return (i + 1) % 2; })));
		}

		const yAxisCall = d3.axisLeft(vis.y);

		vis.xAxisGroup.transition(1000).call(xAxisCall.tickSizeInner(-WIDTH)).selectAll('.tick line').style('opacity', '0.2');
		vis.yAxisGroup.transition(1000).call(yAxisCall.tickSizeInner(-WIDTH)).selectAll('.tick line').style('opacity', '0.2');




		//Declaration Tooltip 
		var Tooltip = d3.select('body').append("div")
			.style("visibility", 'hidden')
			.attr("class", "tool")
			.style("background-color", "#363636")
			.style("border", "solid")
			.style("display", "flex")
			.style("z-index", "10")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style('border-color', 'gray')
			.style("padding", "5px")
			.style('pointer-events', 'none')
			.style("color", 'white')
			.style('position', 'absolute')
			.style('overflow', 'hidden');

		// Vertical line cursor
		var line_hover = d3.select('body').append("div")
			.style("visibility", "hidden")
			.attr("class", "line_cursor")
			.style("z-index", "0")
			.style('pointer-events', 'none')
			.style("background",
				"black")
			.style("overflow", 'hidden')
			.style('position', 'absolute')
			.style('opacity', '0.8');

		// Horizontal line cursor
		var line_hover_x = d3.select('body').append("div")
			.style("visibility", "hidden")
			.attr("class", "line_cursor2")
			.style("z-index", "0")
			.style('pointer-events', 'none')
			.style("background",
				"black")
			.style("overflow", 'hidden')
			.style('position', 'absolute')
			.style('opacity', '0.8');

		// Circle Cursor
		var circle_indicator = d3.select('body').append("div")
			.style("visibility", "hidden")
			.attr("class", "circle_cursor")
			.style("z-index", "10")
			.style('pointer-events', 'none')
			.style("border-radius", '50%')
			.style("overflow", 'hidden')
			.style('position', 'absolute')
			.style('opacity', '1')
			.style('width', '8px')
			.style('height', '8px')
			.style('border', '1.5px solid white');




		// Three function that change the tooltip when user hover / move / leave a cell
		var mouseover = (e, d) => {
			Tooltip
				.style("visibility", 'visible')
				.style("stroke", "black")
				.html(
					`<div> <p style="margin-bottom:0;"> <b>Date</b>: ` + `${d["Date"]} </p>`
					+ `<p style="margin-bottom:0;"> <b>High</b>: ` + `${parseFloat(d["Adjusted_High"]).toFixed(2)} </p>`
					+ ` <p style="margin-bottom:0;"> <b>Low</b>: ` + `${parseFloat(d["Adjusted_Low"]).toFixed(2)} </p>`
					+ `<p style="margin-bottom:0;"> <b>Open</b>: ` + `${parseFloat(d["Adjusted_Open"]).toFixed(2)} </p>`
					+ ` <p style="margin-bottom:0;"> <b>Close</b>: ` + `${parseFloat(d["Adjusted_Close"]).toFixed(2)} </p>`
					+ ` <p style="margin-bottom:0;"> <b>Volume</b>: ` + `${d["Volume"]} </p> </div>`
				);

			line_hover
				.style("visibility", 'visible')
				.style("height", HEIGHT + "px")
				.style("width", 1.5 + "px");

			line_hover_x
				.style("visibility", 'visible')
				.style("height", 1.5 + "px")
				.style("width", WIDTH + "px");

			circle_indicator
				.style("visibility", 'visible')
				.style("background", vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
					: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
						: d3.schemeSet1[8]);


			// .style("left", vis.x(new Date(d['Date']))+MARGIN.LEFT+(candle_width/3) + "px");
			// d3.select(".mouseLine")
			// .style("opacity", "1");

		}
		var mousemove = (e, d) => {
			line_hover
				.style("left", (e.pageX) + "px")
				.style("top", element.childNodes[0].getBoundingClientRect().top + window.scrollY + MARGIN.TOP + "px");

			line_hover_x
				.style("left", element.childNodes[0].getBoundingClientRect().left + window.scrollX + MARGIN.LEFT + "px")
				.style("top", element.childNodes[0].getBoundingClientRect().top + window.scrollY + + MARGIN.TOP + vis.yScaling(parseFloat(d["Adjusted_Close"])) + "px");

			circle_indicator
				.style("left", (e.pageX) - 3.25 + "px")
				.style("top", element.childNodes[0].getBoundingClientRect().top + window.scrollY - 3.25 + MARGIN.TOP + vis.yScaling(parseFloat(d["Adjusted_Close"])) + "px");

			// console.log(xAxisCall)

			// .style("top", - (HEIGHT + MARGIN.BOTTOM) + "px");

			Tooltip
				.style("left", (e.pageX) + (candle_width * 1.2) + "px")
				.style("top", (e.pageY) - 20 + "px");


		}
		var mouseleave = () => {
			Tooltip
				.style('visibility', 'hidden');

			line_hover
				.style('visibility', 'hidden');

			line_hover_x
				.style('visibility', 'hidden');

			circle_indicator
				.style('visibility', 'hidden');

			// console.log('DETECTED OUT')
			// d3.select(".mouseLine")
			// .style("opacity", "0");

		}



		//Declare Volume Bars
		const volBar = vis.g
			.selectAll(".volBar")
			.data(data)
			.attr("transform", d => `translate(${(vis.x(new Date(d.Date))) - ((candle_width / 6))},0)`);

		// EXIT
		volBar.exit()
			.transition(1000)
			.attr("d", vis.y(0))
			.remove()

		// console.log(vis.y(HEIGHT))
		// console.log(HEIGHT)


		// UPDATE
		volBar.transition(1000)
			// .attr("x", d => { return vis.x(d['Date']); })
			.attr("y", d => { return HEIGHT - ((((parseFloat(d["Volume"])) / (d3.max(data, d => { return parseFloat(d['Volume']) }))) * HEIGHT) / 6); })
			.attr("class", "volBar")
			.attr("height", d => { return ((((parseFloat(d["Volume"])) / (d3.max(data, d => { return parseFloat(d['Volume']) }))) * HEIGHT) / 6); })
			.attr("width", candle_width)
			.attr("fill", d3.schemeSet1[8])
			.attr("fill", d => vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
				: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
					: d3.schemeSet1[8])
			.style("opacity", 0.4);

		// ENTER
		volBar.enter().append('rect')
			// .attr("x", d => { return vis.x(d['Date']); })
			.attr("y", d => { return HEIGHT - ((((parseFloat(d["Volume"])) / (d3.max(data, d => { return parseFloat(d['Volume']) }))) * HEIGHT) / 6); })
			.attr("class", "volBar")
			.attr("height", d => { return ((((parseFloat(d["Volume"])) / (d3.max(data, d => { return parseFloat(d['Volume']) }))) * HEIGHT) / 6); })
			.attr("width", candle_width)
			.attr("fill", d3.schemeSet1[8])
			.attr("transform", `translate(${-(candle_width / 2)}, 0)`)
			.attr("fill", d => vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
				: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
					: d3.schemeSet1[8])
			.style("opacity", 0.4);

		// Stick SVG declaration
		const stick = vis.g
			.selectAll(".stick")
			.data(data)
			.attr("transform", d => `translate(${(vis.x(new Date(d.Date))) + ((candle_width / 6 * 1.25))},0)`);

		// Stick Exit on Update
		stick.exit()
			.transition(1000)
			.attr("d", vis.y(0))
			.remove()

		// Stick Initialization
		stick.transition(1000)
			// .attr("x", d => { return vis.x(d['Date']); })
			.attr("y", d => { return vis.y(parseFloat(d["Adjusted_High"])); })
			.attr("class", "stick")
			.attr("height", d => { return vis.y(parseFloat(d["Adjusted_Low"])) - vis.y(parseFloat(d["Adjusted_High"])); })
			.attr("width", candle_width / 4)
			.attr("fill", d3.schemeSet1[8])

		// Stick Update
		stick.enter().append('rect')
			// .attr("x", d => { return vis.x(d['Date']); })
			.attr("y", d => { return vis.y(parseFloat(d["Adjusted_High"])); })
			.attr("class", "stick")
			.attr("height", d => { return vis.y(parseFloat(d["Adjusted_Low"])) - vis.y(parseFloat(d["Adjusted_High"])); })
			.attr("width", candle_width / 4)
			.attr("fill", d3.schemeSet1[8])
			.attr("transform", `translate(${-(candle_width / 4)}, 0)`);

		// Candle SBG declaration
		const candle = vis.g
			.selectAll(".candle")
			.data(data)
			.attr("transform", d => `translate(${(vis.x(new Date(d.Date))) - ((candle_width / 6))},0)`);

		// Candle Exit on Update
		candle.exit()
			.transition(1000)
			.attr("d", vis.y(0))
			.remove()

		// Candle Initialization
		candle.transition(1000)
			// .attr("x", d => { console.log(vis.x(d['Date'])) ;return vis.x(d['Date']); })
			.attr("y", d => { return vis.y(d3.max([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])); })
			.attr("height", function (d) { return vis.y(d3.min([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])) - vis.y(d3.max([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])); })
			.attr("class", "candle")
			.attr("width", candle_width)
			.attr("fill", d => vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
				: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
					: d3.schemeSet1[8]);

		// Candle Update
		candle.enter().append("rect")
			// .attr("x", d => { return vis.x(d['Date']); })
			.attr("y", d => { return vis.y(d3.max([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])); })
			.attr("height", function (d) { return vis.y(d3.min([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])) - vis.y(d3.max([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])); })
			.attr("class", "candle")
			.attr("width", candle_width)
			.attr("fill", d => vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
				: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
					: d3.schemeSet1[8]);

		// Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
		var zoom = d3.zoom()
			.scaleExtent([1, 10])  // This control how much you can unzoom (x0.5) and zoom (x10)
			.extent([[0, 0], [WIDTH, HEIGHT]])
			.on("zoom", zoomChart);
		// Line Overlay declaration
		const lineIndex = vis.g
			.selectAll(".mouseLine")
			.data(data)
			.attr("transform", d => `translate(${vis.x(new Date(d.Date)) + (candle_width / 2)},0)`);

		// Line Overlay Exit on Update
		lineIndex.exit()
			.transition(1000)
			.attr("d", vis.y(0))
			.remove()

		// Line Overlay Initialization
		lineIndex.transition(1000)
			.attr("x", d => {
				// console.log(vis.x(d['Date'])); 
				return vis.x(d['Date']);
			})
			.attr("y1", 0)
			.attr("y2", HEIGHT)
			.attr("class", "mouseLine")
			.style("z-index", "1000")
			.style("stroke", "black")
			.style("stroke-width", ((WIDTH / data.length) / 1.1))
			.style("opacity", "0");

		// Line Overlay Update
		lineIndex.enter().append("line")
			.attr("x", d => { return vis.x(d['Date']); })
			.attr("y1", 0)
			.attr("y2", HEIGHT)
			.attr("class", "mouseLine")
			.attr("class", "mouseLine")
			.style("z-index", "1000")
			.style("stroke", "black")
			.style("stroke-width", ((WIDTH / data.length) / 1.1))
			.style("opacity", "0")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseout", mouseleave);

		vis.g.call(zoom, d3.zoomIdentity)

		vis.g.style("pointer-events", "all").call(zoom, d3.zoomIdentity)

		// A function that updates the chart when the user zoom and thus new boundaries are available
		function zoomChart(event) {

			// recover the new scale
			var newX = event.transform.rescaleX(vis.x);
			var newY = event.transform.rescaleY(vis.y);

			vis.xScaling = newX
			vis.yScaling = newY

			candle_width = ((WIDTH * event.transform.k) / (data.length)) / 1.5

			//Method to Adjust X-axis
			function timePeriodChecker(data, xaxisScale) {
				let vis = this
				//Tick Values for a Week
				if (data.length <= 5) {
					return (d3.axisBottom(xaxisScale).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeDay.every())).tickValues(data.map(d => new Date(d.Date)));
				}
				//Tick Values for a Month
				else if ((data.length > 5) && (data.length <= 25)) {
					return (d3.axisBottom(xaxisScale).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeMonday.every(1)));
				}
				//Tick Values for 3 Months
				else if ((data.length > 25) && (data.length <= 75)) {
					return (d3.axisBottom(xaxisScale).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeMonday.every(3)));
				}
				//Tick Values for 1 Year
				else if ((data.length > 75) && (data.length <= 255)) {
					return (d3.axisBottom(xaxisScale).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeMonth.every(2)));
				}
				//Tick Values for 5 Years
				else if ((data.length > 255) && (data.length <= 1275)) {
					return (d3.axisBottom(xaxisScale).tickFormat(d3.timeFormat('%a %d %b')).ticks(d3.timeYear.every(1)));
				}

			}



			var xAxisCall = timePeriodChecker(data, newX)

			if (vis.mode < 2) {
				xAxisCall = (d3.axisBottom(newX).tickFormat(d3.timeFormat('%d %b %I:%M %p')).tickValues(data.map(d => new Date(d.Date)).filter(function (_, i) { return (i + 1) % 2; }).filter(function (_, i) { return (i + 1) % 2; })));
			}

			const yAxisCall = d3.axisLeft(newY);

			vis.xAxisGroup.transition(1000).call(xAxisCall.tickSizeInner(-WIDTH)).selectAll('.tick line').style('opacity', '0.2');
			vis.yAxisGroup.transition(1000).call(yAxisCall.tickSizeInner(-WIDTH)).selectAll('.tick line').style('opacity', '0.2');

			// console.log(newX(WIDTH))
			// console.log(WIDTH)
			// console.log(event.transform.k)
			// console.log(data.map(d => (newX(new Date(d.Date))) - ((candle_width/6)) + `${d["Volume"]}`) )


			// UPDATE
			volBar.transition(1000)
				// .attr("x", d => { return vis.x(d['Date']); })
				.attr("transform", d => {
					if ((newX(new Date(d.Date))) - ((candle_width / 6)) < -10) {
						return `translate(-1000,0)`
					}
					else {
						return `translate(${(newX(new Date(d.Date))) - ((candle_width / 6))},0)`
					}
				})
				.attr("y", d => { return HEIGHT - ((((parseFloat(d["Volume"])) / (d3.max(data, d => { if ((newX(new Date(d.Date))) - ((candle_width / 6)) > - 10) { return parseFloat(d['Volume']) } else { return 0 } }))) * HEIGHT) / 6); })
				.attr("class", "volBar")
				.attr("height", d => { return ((((parseFloat(d["Volume"])) / (d3.max(data, d => { if ((newX(new Date(d.Date))) - ((candle_width / 6)) > -10) { return parseFloat(d['Volume']) } else { return 0 } }))) * HEIGHT) / 6); })
				.attr("width", candle_width)
				.attr("fill", d3.schemeSet1[8])
				.attr("fill", d => vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
					: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
						: d3.schemeSet1[8])
				.style("opacity", 0.4);


			// Line Overlay Initialization
			lineIndex.transition(1000)
				.attr("transform", d => {
					if ((newX((new Date(d.Date)))) < -1) {
						return `translate(-1000,0)`
					}
					else {
						return `translate(${(newX(new Date(d.Date))) + (candle_width / 2)},0)`
					}
				})
				.attr("y1", 0)
				.attr("y2", HEIGHT)
				.attr("class", "mouseLine")
				.style("z-index", "1000")
				.style("stroke", "black")
				.style("stroke-width", (candle_width * 1.5))
				.style("opacity", "0");

			// Candle Initialization
			candle.transition(1000)
				// .attr("x", d => { console.log(vis.x(d['Date'])) ;return vis.x(d['Date']); })
				.attr("transform", d => {
					if ((newX(new Date(d.Date))) - ((candle_width / 6)) < -10) {
						return `translate(-1000,0)`
					}
					else {
						return `translate(${(newX(new Date(d.Date))) - ((candle_width / 6))},0)`
					}
				})
				.attr("y", d => { return newY(d3.max([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])); })
				.attr("height", function (d) { return newY(d3.min([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])) - newY(d3.max([parseFloat(d["Adjusted_Open"]), parseFloat(d["Adjusted_Close"])])); })
				.attr("class", "candle")
				.attr("width", candle_width)
				.attr("fill", d => vis.y(parseFloat(d['Adjusted_Open'])) > vis.y(parseFloat(d['Adjusted_Close'])) ? d3.schemeSet1[2]
					: vis.y(parseFloat(d['Adjusted_Close'])) > vis.y(parseFloat(d['Adjusted_Open'])) ? d3.schemeSet1[0]
						: d3.schemeSet1[8]);

			// Stick Initialization
			stick.transition(1000)
				// .attr("x", d => { return vis.x(d['Date']); })
				.attr("transform", d => {
					if ((newX(new Date(d.Date))) - ((candle_width / 6)) < -10) {
						return `translate(-1000,0)`
					}
					else {
						return `translate(${(newX(new Date(d.Date))) + ((candle_width / 6 * 1.25))},0)`
					}
				})
				.attr("y", d => { return newY(parseFloat(d["Adjusted_High"])); })
				.attr("class", "stick")
				.attr("height", d => { return newY(parseFloat(d["Adjusted_Low"])) - newY(parseFloat(d["Adjusted_High"])); })
				.attr("width", (candle_width / 4))
				.attr("fill", d3.schemeSet1[8])

			// // update circle position
			// scatter
			// .selectAll("circle")
			// .attr('cx', function(d) {return newX(d.Sepal_Length)})
			// .attr('cy', function(d) {return newY(d.Petal_Length)});
			if (event.transform.k === 1) {
				event.transform.x = 0
				event.transform.y = 0
				vis.update(vis.element, vis.data, vis.stock, vis.mode)
			}
		}


	}

}

export default CSChart