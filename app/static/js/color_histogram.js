function update_color_histogram(dataset_data) {
    // Remove old view
    d3.select("#color_histogram").selectAll("*").remove();

    // Set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        innerRadius = 80,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // Append the svg object to the body of the page
    var color_histogram = d3.select("#color_histogram")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")"); // Add 100 on Y translation, cause upper bars are longer

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

    // Filter the data based on color and creation year
    var num_bins = 32;
    var color_bins = [];
    var color_labels = [];

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
                        color_labels.push(color_str);
                    } else {
                        for (color_bin in color_bins) {
                            var new_found = 0;
                            if (color_str == color_bins[color_bin]["Color_name"]) {
                                color_bins[color_bin]["Amount"] += 1;
                                new_found = 1;
                                break;
                            }
                        }
                        if (new_found == 0) {
                            color_bins.push({"Color_name": color_str, "Amount": 1});
                            color_labels.push(color_str);
                        }
                    }   
                }
            } 
        }
    }


    // Get maximum number of occurences per color
    max_num = 0;
    for (color_bin in color_bins) {
        if (color_bins[color_bin]["Amount"] > max_num) {
            max_num = color_bins[color_bin]["Amount"];
        }
    }

    // Scales
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(color_labels); // The domain of the X axis is the list of states.
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, max_num]); // Domain of Y is from 0 to the max seen in the data


    console.log(("rgb(" + color_bins[0]["Color_name"] + ")"));
    console.log(function(d) {return(color_bins.Color_name)});

    // Add the bars
    color_histogram.append("g")
        .selectAll("path")
        .data(color_bins)
        .enter()
        .append("path")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d.Amount); })
            .startAngle(function(d) { return x(d.Color_name); })
            .endAngle(function(d) { return x(d.Color_name) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))
            .style("fill", function(d,i) { return ("rgb(" + color_bins[i]["Color_name"] + ")")});

    // Show the labels
    color_histogram.append("g")
        .selectAll("g")
        .data(color_bins)
        .enter()
        .append("g")
            .attr("text-anchor", function(d) { return (x(d.Color_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((x(d.Color_name) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.Amount)+10) + ",0)"; })
        .append("text")
            .text(function(d){return(d.Amount)})
            .attr("transform", function(d) { return (x(d.Color_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle");
}