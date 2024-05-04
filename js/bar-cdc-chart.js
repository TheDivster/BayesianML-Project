/** Class representing the line chart view. */
class BarCdcChart {
    /**
     * Creates a LineChart
     * @param globalApplicationState The shared global application state (has the data and map instance in it)
     */
    constructor(globalApplicationState) {
      // Set some class level variables
      this.globalApplicationState = globalApplicationState;

      // Useful field
      const MARGIN = { left: 80, bottom: 80, top: 12, right: 50 };
      
      // Create scales for x and y axes
      let data = globalApplicationState.cdcData;

      // Get height and width
      const svgElement = d3.select('#bar-chart-cdc').node();
      const svgDimensions = svgElement.getBoundingClientRect();

      const width = svgDimensions.width - 87;
      const height = svgDimensions.height - 100;
      
      console.log(width);
      console.log(height);


      const xScale = d3.scaleBand()
      .domain(data.map(d => d.STATE))
      .range([0, width])
      .padding(0.1);

      const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => parseFloat(d.RATE))])
      .nice()
      .range([height, 0]);

      let barChart = d3.select("#bars-cdc");

      barChart
      .selectAll('.bar_cdc')
      .data(data)
      .enter()
      .append("rect")
      .attr('class', 'bar')
      .attr("x", d => xScale(d.STATE))
      .attr("y", d => yScale(d.RATE))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.RATE))
      .attr('fill', '#CC7722');

      // Add x-axis-cdc
      let xAxisGroup = d3.select("#x-axis-cdc");

      const xAxis = xAxisGroup
      .attr("class", "x-axis-cdc")
      .attr("transform", `translate(0, ${width})`)
      .call(d3.axisBottom(xScale));

      // Rotate x-axis-cdc tick labels
      xAxis.selectAll("text")
      .attr("transform", "rotate(-50)") // Rotate the labels by -45 degrees
      .style("text-anchor", "end");

      // x-axis-cdc label
      d3.select("#x-axis-cdc")
      .append("text")
      .attr("transform", `translate(${width / 2}, ${ MARGIN.bottom})`)  // Adjust the position as needed
      .style("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("States");

      // title label
      d3.select("#overlay-cdc")
      .append("text")
      .attr("transform", `translate(${width / 2 + MARGIN.left}, ${ MARGIN.top})`)  // Adjust the position as needed
      .style("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Life Expectancy (years) vs. States");

      // Add y-axis-cdc
      d3.select("#y-axis-cdc")
      .attr("class", "y-axis-cdc")
      .call(d3.axisLeft(yScale));

      // y-axis-cdc label
      d3.select("#y-axis-cdc")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 30 - MARGIN.left)
      .attr("x", 0 - height / 2)
      .style("fill", "black")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Life Expectancy (years)");

      d3.select("#x-axis-cdc")
      .attr("transform", `translate(${MARGIN.left},${height + MARGIN.top})`);
      d3.select("#y-axis-cdc")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
      d3.select("#bars-cdc")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    }
  
    updateSelectedCountries () {
  
    }
  }