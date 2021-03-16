function update_map(datasetData){
    // import {legend} from "@d3/color-legend"

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
        world_map.selectAll('path')
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
                var filtered_years = datasetData[countryCode[d.id]]['creation_year'].filter(it=>it<upper_year && it>lower_year);
                // var  = datasetData[countryCode[d.id]]['id'] || [];
                return colorScale(filtered_years.length);
            }).on("mouseover", function (d, i) {
                // hideTooltip()
                var cur_data = datasetData[countryCode[d.id]] || {"artist_full_name":"", "artwork_name":[""]};
                displayTooltip("<b>Top artist</b>" + cur_data['artist_full_name'] + "%<br /><b>artwork: </b>" + cur_data['artwork_name'][0])
                
                //d3.select(this).attr("fill", "DarkOrange");
            }).on("mouseout", function (d, i) {
                hideTooltip()
            }).on("click", function(d){
                if(country_id)
                    d3.select("#"+country_id).style("fill", prev_country_color);
                prev_country_color = d3.select(this).style("fill");
                d3.select(this).style("fill", "green");
                country_id = countryCode[d.id];
                country_name = countryName[d.id];
                // TODO: update artist selection
                update_artist_picker(datasetData);
                // TODO: update gallery
                update_gallery(datasetData);
            })
            ;
            // .append('title')
            // .text(d => countryName[d.id])
    });
}
