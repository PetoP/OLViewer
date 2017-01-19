// geojson s hranicou SR
var hranica = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "./data/hranica.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#2980B9",
            width: 1
        })
    })
});

// definície projekcií
proj4.defs("EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
proj4.defs("SK_LCC", "+proj=lcc +lat_1=48 +lat_2=49.333333 +lon_0=19.4849068946685 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");

var tm33n = new ol.proj.Projection({
    code: "EPSG:32633",
    worldExtent: [12, 18, 0, 84],
    extent: [166021.4431, 833978.5569, 0, 9329005.1825]
});
var lccsk = new ol.proj.Projection({
    code: "SK_LCC",
    worldExtent: [16.8332, 47.7314, 22.5657, 49.6138],
    extent: [-196375.44, 5919135.26, 224971.35, 6127760.38]
});

var proj = tm33n;

// nastavenie pohľadu
var view = new ol.View({
    center: ol.proj.transform([17.9047990517937, 48.4608516791396], "EPSG:4326", proj),
    // extent: [-196375.44, 5919135.26, 224971.35, 6127760.38],
    zoom: 8,
    projection: proj
});

hranica.on("change", function() {
    view.fit(hranica.getSource().getExtent(), map.getSize());
});

// mapa
var map = new ol.Map({
    layers: [
        hranica
    ],
    target: "map",
    view: view,
    controls: []
});


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
        document.getElementById("y").innerHTML = document.getElementById("x").innerHTML.replace(".", ",");
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
    view.setZoom(view.getZoom() + 1);
};
document.getElementById("zoomout").onclick = function() {
    view.setZoom(view.getZoom() - 1);
};
