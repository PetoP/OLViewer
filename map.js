// geojson s hranicou SR
var hranica = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "./data/hranica_simple.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#343131",
            width: 1
        })
    })
});

// geojson s WRS2
var getWrsText = function(feature) {
    return "P:" + feature.get("PATH") + "\nR:" + feature.get("ROW");
};

var wrsStyle = function(feature) {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#2980B9",
            width: 1
        }),
        text: new ol.style.Text({
            fill: new ol.style.Fill({
                color: "#2980B9"
            }),
            stroke: new ol.style.Stroke({
                color: "white",
                width: 2
            }),
            textAlign: "center",
            text: getWrsText(feature)
        })
    });
};

var wrs = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "./data/WRS2.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: wrsStyle,
    visible: false
});

// geojson s UTM grid
var getUtmText = function(feature) {
    return feature.get("name");
};

var utmStyle = function(feature) {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#5C9632",
            width: 1
        }),
        text: new ol.style.Text({
            fill: new ol.style.Fill({
                color: "#5C9632"
            }),
            stroke: new ol.style.Stroke({
                color: "white",
                width: 2
            }),
            textAlign: "center",
            text: getUtmText(feature)
        })
    });
};

var utm = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "./data/UTM.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: utmStyle,
    visible: false
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

// var proj = tm33n;
var proj = "EPSG:3857";

// nastavenie pohľadu
var view = new ol.View({
    center: ol.proj.transform([17.9047990517937, 48.4608516791396], "EPSG:4326", proj),
    // extent: [-196375.44, 5919135.26, 224971.35, 6127760.38],
    zoom: 8,
    minZoom: 7,
    projection: proj
});

hranica.on("change", function() {
    view.fit(hranica.getSource().getExtent(), map.getSize());
});

// mapa
var map = new ol.Map({
    layers: [
        hranica,
        wrs,
        utm
    ],
    target: "map",
    view: view,
    controls: []
});

// mriežka
// new ol.Graticule({
//     map: map,
//     targetSize: 400,
//     strokeStyle: new ol.style.Stroke({
//         color: "#2980B9",
//         width: 0.3
//     })
// });
