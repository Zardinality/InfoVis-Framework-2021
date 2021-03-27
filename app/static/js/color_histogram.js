function update_color_histogram(dataset_data) {
    // Remove old view
    d3.select("#color_histogram").selectAll("*").remove();

    // Set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 460 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        innerRadius = 80,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // Append the svg object to the body of the page
    var color_histogram = d3.select("#color_histogram")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")"); // Add 100 on Y translation, cause upper bars are longer

    var z_data = [{"Country": "A", "Value": 1}, {"Country": "B", "Value": 3}, {"Country": "C", "Value": 4}, {"Country": "D", "Value": 5}, {"Country": "E", "Value": 0}];
    var x_data = ["A", "B", "C", "D", "E"];

    var filtered_data = []

    // If no country is selected, use the works of all countries
    if (country_id == "") {
        for (id in dataset_data) {
            filtered_data.push(dataset_data[id]['artist_row']);
        }
    } else {
        if ((country_id in dataset_data)) {
            var filtered_data = {[country_name]: dataset_data[country_id]['artist_row']};
        } else { return }   
    }

    // If no artist is selected, use the works of all artists
    if (artist_name != "") {
        var filtered_data = {[country_name] : {[artist_name]: filtered_data[country_name][artist_name]}};
    }                                                                                

    // Get all dominant colors of a view
    console.log(filtered_data)

    // Filter the data based on color and creation year
    var num_bins = 50;
    var color_bins = [];

    for (country in filtered_data) {
        var cur_country = filtered_data[country];
        for (artist in cur_country) {
            var cur_artist = cur_country[artist];
            for (const im_idx of Array(cur_artist.length).keys()) {
                // Filter based on the creation year lower- and upperbound
                if (cur_artist['creation_year'][im_idx] < upper_year && cur_artist['creation_year'][im_idx] > lower_year) {
                    var color = cur_artist['dominant_color'][im_idx].map(function(x) { return Math.floor(x / num_bins) * num_bins; })
                    var color_str = color.toString();
                    // console.log(color_str)

                    // Add the first
                    if (color_bins.length == 0) {
                        color_bins.push({"Color_name": color_str, "Amount": 1});
                    } else {
                        for (color_bin in color_bins) {
                            var new_found = 0;

                            if (color_str == color_bins[color_bin]["Color_name"]) {
                                // console.log("same")
                                color_bins[color_bin]["Amount"] += 1;
                                // console.log(color_bins)
                                new_found = 1;
                                break;
                            } else {
                                // console.log("new")
                            }
                        }
                        if (new_found == 0) {
                            color_bins.push({"Color_name": color_str, "Amount": 1});
                        }
                    }   
                }
            } 
        }
    }

    console.log(color_bins);

    // Scales
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(x_data); // The domain of the X axis is the list of states.
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, 5]); // Domain of Y is from 0 to the max seen in the data

    // Add the bars
    color_histogram.append("g")
    .selectAll("path")
    .data(z_data)
    .enter()
    .append("path")
    .attr("fill", "rgb(0, 100, 200)")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d.Value); })
        .startAngle(function(d) { return x(d.Country); })
        .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius));

    // Add the labels
    color_histogram.append("g")
    .selectAll("g")
    .data(z_data)
    .enter()
    .append("g")
        .attr("text-anchor", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Value'])+10) + ",0)"; })
    .append("text")
        .text(function(d){return(d.Country)})
        .attr("transform", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle");
}