function distance(a) {
    var res = 0;
    res += Math.abs(a[0] - selected_color['r']);
    res += Math.abs(a[1] - selected_color['g']);
    res += Math.abs(a[2] - selected_color['b']);
    return res;
}

function update_gallery(dataset_data) {
    // Obtain the data
    if (!(country_id in dataset_data)) return;
    var cur_data = dataset_data[country_id]['artist_row'][artist_name] || { "image_url": [], "dominant_color": [] };
    var filtered_data = [];
    for (const x of Array(cur_data['image_url'].length).keys()) {
        if (cur_data['creation_year'][x] < upper_year && cur_data['creation_year'][x] > lower_year) {
            filtered_data.push({ "url": cur_data['image_url'][x], "dom_color": cur_data['dominant_color'][x] });
        }
    }
    filtered_data.sort(function (a, b) {
        if (distance(a['dom_color']) > distance(b['dom_color'])) {
            return 1;
        }
        else {
            return -1;
        }
    })
    
    // Select a subset
    var final_data = filtered_data.slice(0, Math.max(5, filtered_data.length));
    
    // Init the image grid
    var width = 1000
    var num_col = 5

    // Clear the previous view
    d3.select("#gallery").selectAll("*").remove();

    var svg = d3.select("#gallery").append("svg")
        .attr("width", width)
        .append("g")
        
    
    final_data.forEach(
        function (img, i){
            svg 
                .append('svg:image')
                .attr("x", ((i % num_col) * (width/num_col)))    
                .attr("y", Math.floor(i / num_col))
                .attr("width", 200)
                .attr("height", 200)
                .attr('xlink:href', img['url'])
        }
    )
}