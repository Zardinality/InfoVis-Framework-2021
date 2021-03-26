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

    // If no artist is selected, use the works of all artists
    if (artist_name == "") {
        console.log("No artist specified")
        var data = dataset_data[country_id]['artist_row'] || { "image_url": [], "dominant_color": [] };
    } else {
        console.log(artist_name)
        var data = {artist_name: dataset_data[country_id]['artist_row'][artist_name] || { "image_url": [], "dominant_color": [] }};
    }

    // Filter the data based on color and creation year
    var filtered_data = [];
    for (artist in data) {
        var cur_artist = data[artist]
        for (const im_idx of Array(cur_artist.length).keys()) {
        // for (work in cur_data[artist]) {
            // Filter based on the creation year lower- and upperbound
            if (cur_artist['creation_year'][im_idx] < upper_year && cur_artist['creation_year'][im_idx] > lower_year) {
                filtered_data.push({ "url": cur_artist['image_url'][im_idx], "dom_color": cur_artist['dominant_color'][im_idx] });
            }
        }
    }

    // Sort the data based on how close the palette picker is to the most dominant color
    filtered_data.sort(function (a, b) {
        if (distance(a['dom_color']) > distance(b['dom_color'])) {
            return 1;
        }
        else {
            return -1;
        } 
    })
    
    // Select a subset
    var final_data = filtered_data.slice(0, filtered_data.length);
    
    // Init the image grid
    var width = 920
    var height = 920
    var num_col = 5

    // Clear the previous view
    d3.select("#gallery").selectAll("*").remove();

    var svg = d3.select("#gallery").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        
    // Show all corresponding images
    final_data.forEach(
        function (img, i){
            svg 
                .append("a")
                .attr("xlink:href", img['url'])
                .append('svg:image')
                .attr("x", ((i % num_col) * (width/num_col)))    
                .attr("y", Math.floor(i/num_col) * (width/num_col))
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 100 100")
                .attr("width", width/num_col)
                .attr("height", width/num_col)
                .attr('xlink:href', img['url'])
        }
    )
}