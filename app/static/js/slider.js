function create_slider(datasetData) {
    d3.select("#lower_bound").on("change", function (d) {
        lower_year = this.value;
        update_map(datasetData);
        update_gallery(datasetData);
    });
    d3.select("#upper_bound").on("change", function (d) {
        upper_year = this.value;
        update_map(datasetData);
        update_gallery(datasetData);
    });
}