/** Class representing the Map view. */
class MapUtahVis {
    /**
     * Creates a Map
     * @param globalApplicationState The shared global application state (has the data and map instance in it)
     */
    constructor(globalApplicationState) {
      // Set some class level variables
      this.globalApplicationState = globalApplicationState;

			// Get height and width
      const svgElement = d3.select('#utah-svg').node();
      const svgDimensions = svgElement.getBoundingClientRect();

      const width = svgDimensions.width - 100;
      const height = svgDimensions.height - 100;

			console.log(width);
			console.log(height);

			// Useful field
      const MARGIN = { left: 80, bottom: 80, top: 12, right: 50 };

            let projection = d3.geoAlbersUsa()
            .translate([width + 400, height]) // this centers the map in our SVG element
            .scale([4000]); // this specifies how much to zoom

			// This converts the projected lat/lon coordinates into an SVG path string
			let path = d3.geoPath(projection);

				// Load in GeoJSON data
			let geoJSON = topojson.feature(globalApplicationState.mapData, globalApplicationState.mapData.objects.states);
			geoJSON = this.globalApplicationState.utahData;

			const ref = this; // used to access the context of the class

			// Bind data and create one path per GeoJSON feature
			d3.select("#utah-state").selectAll("path")
			.data(geoJSON.features)
			.join("path")
			.attr("d", path)
			.attr("class", "county") // Replace with your own logic
			.style("stroke", "#000") // Stroke color
			.style("fill", "#F8F0E3")
			.style("stroke-width", 1) // Stroke width
			.attr("transform", `scale(${1})`)
			.attr("transform", `translate(${MARGIN.left},${0})`);


	let dataLookup = {};
    for (const row of geoJSON.features) {
        // d3.csv will read the values as strings; we need to convert them to floats
        dataLookup[row.properties.name + " "] = NaN;
    }
     for (const row of globalApplicationState.utahTabData) {
      // d3.csv will read the values as strings; we need to convert them to floats
      dataLookup[row.County] = parseFloat(row.Ratio);
  }

     // Now we add the data values to the geometry for every state

    //  geoJSON.features.forEach(function (feature) {
    //   // Assuming 'dataLookup' is an object mapping feature IDs to values
    //   const value = dataLookup[feature.name + " "];
    
    //   // Set a default value of 0 for null or undefined values
    //   feature.properties.value = (value !== null && value !== undefined) ? value : 0;
    // });

     // Define a quantized scale to sort data values into buckets of color
    let color = d3.scaleSequential(d => {
        console.log(d + " data");
      // Check for null values and set them as white
      if (d === NaN || isNaN(d)) {
        console.log("happened");
        return "#F8F0E3";
      }
      // Set the color gradient for non-null values
      console.log(d);
      return d3.interpolateRgb("#F8F0E3", "rgb(42, 42, 154)")(d);
    });

     // Set input domain for color scale based on the min and max
     color.domain([
      d3.min(Object.values(dataLookup)),
      d3.max(Object.values(dataLookup))
  ]);


		// Append a tooltip div
		const tooltip = d3.select("#utah-div")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

    // Bind data and create one path per GeoJSON feature
    d3.select("#utah-state").selectAll("path")
        .data(geoJSON.features)
        .join("path")
        .attr("d", path)
        .style("fill", function (d) {
            return color(dataLookup[d.properties.name + " "]);
        })
				.on("mouseover", function (event, d) {
					d3.select(this)
					.attr("class", "state selected");

					// Show tooltip with state name
					tooltip.transition()
					.duration(200)
					.style("opacity", 0.9);

				tooltip.html(d.properties.name + ", " + dataLookup[d.properties.name + " "])
					.style("left", event.pageX + "px")
					.style("top", event.pageY - 28 + "px");
				})
				.on("mouseout", function (event, d) {
					d3.select(this)
						.attr("class", "state");
					tooltip
						.style("opacity", 0);
				});

				d3.select("#utah-title")
				.append("text")
				.attr("transform", `translate(${width / 2}, ${ MARGIN.top + 100})`)  // Adjust the position as needed
				.style("text-anchor", "middle")
				.style("fill", "black")
				.style("font-size", "16px")
				.style("font-weight", "bold")
				.text("Ratio of hospital beds per people by Utah county");

				// Create a linear gradient definition
				const gradient = d3.select("#utah-svg").append("defs")
				.append("linearGradient")
				.attr("id", "legendGradient")
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
				.attr("style", "stop-color:rgb(42, 42, 154);stop-opacity:1");
		
				// Create a legend rectangle and apply the gradient
				d3.select("#utah-svg").append("rect")
				.attr("x", width - 60)
				.attr("y", height + 30)
				.attr("width", 155)
				.attr("height", 20)
				.attr("fill", "url(#legendGradient)");
		
				d3.select("#utah-svg").append("text")
				.attr("x", width - 60)
				.attr("y", height + 20)
				.text("0");
		
				d3.select("#utah-svg").append("text")
				.attr("x", width + 59)
				.attr("y", height + 20)
				.text("" + d3.max(Object.values(dataLookup)));
    }
  
    updateSelectedStates () {
  
    }
  }
  