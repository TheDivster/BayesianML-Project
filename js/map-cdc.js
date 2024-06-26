/** Class representing the Map view. */
class MapCdcVis {
    /**
     * Creates a Map
     * @param globalApplicationState The shared global application state (has the data and map instance in it)
     */
    constructor(globalApplicationState) {
      // Set some class level variables
      this.globalApplicationState = globalApplicationState;

			// Get height and width
      const svgElement = d3.select('#map').node();
      const svgDimensions = svgElement.getBoundingClientRect();

      const width = svgDimensions.width - 100;
      const height = svgDimensions.height - 100;

			console.log(width);
			console.log(height);

			// Useful field
      const MARGIN = { left: 80, bottom: 80, top: 12, right: 50 };

			// This converts the projected lat/lon coordinates into an SVG path string
			let path = d3.geoPath();

				// Load in GeoJSON data
			let geoJSON = topojson.feature(globalApplicationState.mapData, globalApplicationState.mapData.objects.states);
			
			const ref = this; // used to access the context of the class

			// Bind data and create one path per GeoJSON feature
			d3.select("#states-cdc").selectAll("path")
			.data(geoJSON.features)
			.join("path")
			.attr("d", path)
			.attr("class", "state cdc") // Replace with your own logic
			.style("stroke", "#000") // Stroke color
			.style("fill", "#F8F0E3")
			.style("stroke-width", 0) // Stroke width
			.attr("transform", `scale(${1})`)
			.attr("transform", `translate(${MARGIN.left},${0})`);


			let dataLookup = {};
     for (const row of globalApplicationState.cdcModifiedData) {
      // d3.csv will read the values as strings; we need to convert them to floats
      dataLookup[row.STATE] = parseFloat(row.RATE);
  }

     // Now we add the data values to the geometry for every state

     geoJSON.features.forEach(function (feature) {
      // Assuming 'dataLookup' is an object mapping feature IDs to values
      const value = dataLookup[feature.name];
    
      // Set a default value of 0 for null or undefined values
      feature.properties.value = (value !== null && value !== undefined) ? value : 0;
    });

     // Define a quantized scale to sort data values into buckets of color
    let color = d3.scaleSequential(d => {

      // Check for null values and set them as white
      if (d === null || isNaN(d)) {
        return "#F8F0E3";
      }
      // Set the color gradient for non-null values
      console.log(d);
      return d3.interpolateRgb("#F8F0E3", "#CC7722")(d);
    });

     // Set input domain for color scale based on the min and max
     color.domain([
      d3.min(Object.values(dataLookup)),
      d3.max(Object.values(dataLookup))
  ]);


		// Append a tooltip div
		const tooltip = d3.select("#map-cdc-div")
		.append("div")
		.attr("class", "tooltip-cdc")
		.style("opacity", 0);

    // Bind data and create one path per GeoJSON feature
    d3.select("#states-cdc").selectAll("path")
        .data(geoJSON.features)
        .join("path")
        .attr("d", path)
        .style("fill", function (d) {
            return color(dataLookup[d.properties.name]);
        })
		.on("mouseover", function (event, d) {
			d3.select(this)
				.attr("class", "state selected cdc");
		
			// Show tooltip with state name
			tooltip.transition()
				.duration(200)
				.style("opacity", 0.9);
		
			// Calculate the tooltip position relative to the mouse pointer
			const tooltipX = event.pageX + 10;  // You can adjust the offset as needed
			const tooltipY = event.pageY - 28; // You can adjust the offset as needed
		
			tooltip.html(d.properties.name + ", " + dataLookup[d.properties.name])
				.style("left", tooltipX + "px")
				.style("top", tooltipY + "px");
		})
		.on("mouseout", function (event, d) {
			d3.select(this)
				.attr("class", "state-cdc");
			
			tooltip
				.style("opacity", 0);
		});

				d3.select("#title-cdc")
				.append("text")
				.attr("transform", `translate(${width / 2}, ${ MARGIN.top})`)  // Adjust the position as needed
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "16px")
				.style("font-weight", "bold")
				.text("Life Expectancy by State");

				// Create a linear gradient definition
				const gradient = d3.select("#map-cdc").append("defs")
				.append("linearGradient")
				.attr("id", "legendGradient-svg")
				.attr("x1", "0%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "0%");
		
				// Add color stops to the gradient
				gradient.append("stop")
				.attr("offset", "0%")
				.attr("style", "stop-color:#F8F0E3;stop-opacity:1");
		
				gradient.append("stop")
				.attr("offset", "100%")
				.attr("style", "stop-color:#CC7722;stop-opacity:1");
		
				// Create a legend rectangle and apply the gradient
				d3.select("#map-cdc").append("rect")
				.attr("x", width - 60)
				.attr("y", height + 30)
				.attr("width", 150)
				.attr("height", 20)
				.attr("fill", "url(#legendGradient-svg)");
		
				d3.select("#map-cdc").append("text")
				.attr("x", width - 60)
				.attr("y", height + 20)
				.text("0");
		
				d3.select("#map-cdc").append("text")
				.attr("x", width + 70)
				.attr("y", height + 20)
				.text("" + d3.max(Object.values(dataLookup)));
    }
  
    updateSelectedStates () {
  
    }
  }
  