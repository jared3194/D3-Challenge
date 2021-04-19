// initialize variables for svg measurements
var svgWidth = 960;
var svgHeight = 500;
var margin = {top:20, right:40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create a SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var chart = svg.append("g");

d3.select("#scatter").append("div").attr("class","tooltip").style("opacity",0);

//read in CSV data using d3
d3.csv('assets/data/data.csv').then(function(healthData) {

    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    
    var yLinearScale = d3.scaleLinear().range([height,0]);
    var xLinearScale = d3.scaleLinear().range([0,width]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //scale

    xLinearScale.domain([7,d3.max(healthData, function(data) {
            return +data.poverty;
        }),
    ]);
    yLinearScale.domain([0, d3.max(healthData, function(data) {
        return +data.smokes;
        }),
    ]);


    // create tooltip

    var toolTip = d3
        .tip()
        .attr("class", "toolTip")
        .style("background-color", "grey")
        .style("border", "solid")
        .style("font-weight", "bold")
        .style("opacity", .75)
        .offset([80,-60])
        .html(function(data){
            var stateName = data.state;
            var pov = +data.poverty;
            var smoke = +data.smokes;
            return(stateName + "<br> Poverty(%): " + pov + "<br> Smoker Age (Median) " + smoke
            );
        });
    chart.call(toolTip);

    // add mouse over event to allow tooltip to show when mosuing over data point
    chart
        .selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.smokes))
        .attr("r", "10")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("opacity", 0.75)
        .attr("fill", "lightblue")
        .on("mouseover", function(data ) {
            toolTip.show(data,this)
            .style("left", d + "px")     
            .style("top", d + "px");
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data,this);
        });
    
    chart
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g").call(leftAxis);


    //Add state abbreviations to inside of each circle 
    svg.selectAll(".dot")
    .data(healthData)
    .enter()
    .append("text")
    .text(function(data){return data.abbr;})
    .attr("x", function(data){
        return xLinearScale(data.poverty);
    })
    .attr("y", function(data) {
        return yLinearScale(data.smokes);
    })
    .attr("font-size","9px")
    .attr("fill","blue")
    .style("text-anchor","middle");
    
    //add and format Y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - height * .65)
        .attr("dy","1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Median Age of Smokers");


    //add and format X-axis label
    chart
        .append("text")
        .attr("transform","translate(" + width * .5 + " , " + (height + margin.top + 30) + ")",)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("In Poverty (%)");
}).catch(function(error){
    console.log(error);
});