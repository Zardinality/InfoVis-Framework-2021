function update_navbar() {
    document.getElementById("country_name").innerHTML = country_name + " ";
    document.getElementById("artist_name").innerHTML = artist_name + " ";
    document.getElementById("selected_color").style.color = 
        "rgb(" + 
        selected_color["r"] + "," + 
        selected_color["g"] + "," + 
        selected_color["b"] + 
        ")"
}

function update_divcol() {
    document.getElementById("divcol").style.backgroundColor = 
        "rgb(" + 
            selected_color["r"] + "," + 
            selected_color["g"] + "," + 
            selected_color["b"] + 
            ")"
}
