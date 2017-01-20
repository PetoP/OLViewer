// objekt na uchovávanie a vypisovanie informácií do lišty
var trayInfo = {
    position_: [0, 0],
    print: function() {
        var x = Math.round(this.position_[0] * 1000) / 1000;
        var y = Math.round(this.position_[1] * 1000) / 1000;
        if ((x * 1000) % 10 == 0) {
            if ((x * 1000) % 1000 == 0) {
                x = x + ".000";
            } else if ((x * 1000) % 100 == 0) {
                x = x + "00";
            } else {
                x = x + "0";
            }
        }
        if ((y * 1000) % 10 == 0) {
            if ((y * 1000) % 1000 == 0) {
                y = y + ".000";
            } else if ((y * 1000) % 100 == 0) {
                y = y + "00";
            } else {
                y = y + "0";
            }
        }
        document.getElementById("x").innerHTML = "<p>" + x + "</p>";
        document.getElementById("y").innerHTML = "<p>" + y + "</p>";
        document.getElementById("x").innerHTML = document.getElementById("x").innerHTML.replace(".", ",");
        document.getElementById("y").innerHTML = document.getElementById("y").innerHTML.replace(".", ",");
    },
    setPosition: function(position) {
        this.position_ = position;
        this.print();
    }
};

trayInfo.print();
map.on("pointermove", function(e) {
    trayInfo.setPosition(ol.proj.transform(map.getCoordinateFromPixel(e.pixel), view.getProjection(), "EPSG:4326"));
});

// funkcie zoomovacích tlačítiek
// TODO: dorob efekt pohybu
document.getElementById("zoomin").onclick = function() {
    view.animate({zoom: view.getZoom() + 1, duration: 250});
};
document.getElementById("zoomout").onclick = function() {
    view.animate({zoom: view.getZoom() - 1, duration: 250});
};

// fukncie tlačítok vrstiev
document.getElementById("wrs").onclick = function() {
    wrs.setVisible(!wrs.getVisible());
};

wrs.on("change:visible", function() {
    var color;
    if (wrs.getVisible() == true) {
        color = "#2980B9";
    } else {
        color = "#717171";
    }
    document.getElementById("wrst").style.color = color;
});

document.getElementById("utm").onclick = function() {
    utm.setVisible(!utm.getVisible());
};

utm.on("change:visible", function() {
    var color;
    if (utm.getVisible() == true) {
        color = "#5C9632";
    } else {
        color = "#717171";
    }
    document.getElementById("utmt").style.color = color;
});
