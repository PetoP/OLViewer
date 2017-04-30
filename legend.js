// funkcia tlačítka zobrazujúceho legendu
var legendVisible = false;
var duration = 500;

document.getElementById("otvor_legendu").onclick = function() {
    if (legendVisible == true) {
        legendVisible = false;
        document.getElementById("otvor_legendu").style.background = "#343131";
        document.getElementById("legend_tlac").style.color = "#717171";
        $("#legend").hide(duration);
    } else {
        legendVisible = true;
        document.getElementById("otvor_legendu").style.background = "#B58900";
        document.getElementById("legend_tlac").style.color = "white";
        $("#legend").show(duration);
    }
};

$("#legend").toggle(legendVisible);
