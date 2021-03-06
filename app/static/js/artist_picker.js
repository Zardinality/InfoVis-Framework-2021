function update_artist_picker(datasetData) {

    var myWords = [];

    // If no country is selected, use the works of all countries
    if (country_id == "") {
        // The wordcloud is unfortunately too slow to show the cloud for all the artists
    } else {
        for(var a_name in datasetData[country_id]["artist_row"]){
            myWords.push({word: a_name, size: 10*datasetData[country_id]['artist_row'][a_name].creation_year.filter(it=>it<=upper_year && it>=lower_year).length});
        }
    }


    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    d3.select("#artist_picker").selectAll("*").remove();
    // append the svg object to the body of the page
    var svg = d3.select("#artist_picker")
        .append("div")
        .classed("svg-container", true) 
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 500 500")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
        .padding(5)        //space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize(function (d) { return d.size; })      // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size / 1.2; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Poppins")
            .style("cursor", "pointer")
            .style("text-transform", "capitalize")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; })
            .on("click", function(d){
                artist_name = d.text;
                // TODO: update gallery
                update_navbar();
                update_color_histogram(datasetData);
                update_gallery(datasetData);
            })
            .on("mouseover", function(d) {
                displayTooltip(
                    "<b>Number of works: </b>" + d.size / 10
                )
            })
            .on("mouseout", function (d, i) {
                hideTooltip()
            });
    }
}
