
function update_map(datasetData){
    d3.select("#world_map").selectAll("*").remove();



    console.log(lower_year)
    console.log(upper_year)

	world_map = d3.select('#world_map')
		.append("div")
			.classed("svg-container", true) 
            .style("padding-bottom",  "50%")
			.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 1000 500")
			.classed("svg-content-responsive", true)    

    // Load datasets
    Promise.all([
        // Load world map
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json"),

        // Load file with country information
        d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/110m.tsv"),
    ]).then(([topoJSONdata, tsvData]) => {

        // Retrieve country information
        const countryName = {};
        const countryCode = {};
        tsvData.forEach(d => {
            countryName[d.iso_n3] = d.name;
            countryCode[d.iso_n3] = d.adm0_a3;
        });

        // Project the world map
        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

        world_map.selectAll('world_map')
            .data(countries.features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('id', function(d){
                return countryCode[d.id];
            })
            .style("fill", function (d) {
                if (!datasetData[countryCode[d.id]]) {
                    return colorScale(0)
                }
                var filtered_years = datasetData[countryCode[d.id]]['creation_year'].filter(it=>it<=upper_year && it>=lower_year);

                return colorScale(filtered_years.length);
            })

            .on("mouseover", function (d, i) {
                var cur_data = datasetData[countryCode[d.id]] || {"artist_full_name":"", "artwork_name":[""]};
                var artist_name_wo_rep = [... new Set(cur_data['artist_full_name'])];
                displayTooltip("<b>Country:</b>" + countryName[d.id] + "<br /><b>Top artist:</b>" + artist_name_wo_rep.slice(0, 10) + "<br /><b>Artwork: </b>" + cur_data['artwork_name'][0])
            })
            .on("mouseout", function (d, i) {
                hideTooltip()
            })
            .on("click", function(d){
                if(country_id)
                    d3.select("#"+country_id).style("fill", prev_country_color);
                prev_country_color = d3.select(this).style("fill");
                d3.select(this).style("fill", "green");
                country_id = countryCode[d.id];
                country_name = countryName[d.id];

                // Reset the selected artist
                artist_name = "All artists"

                // Update the other views
                update_navbar();
                update_color_histogram(datasetData)
                update_artist_picker(datasetData);
                update_gallery(datasetData);
            });
    });
}
