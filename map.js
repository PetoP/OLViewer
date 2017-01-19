var hranica = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "./data/hranica.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "red",
            width: 2
        })
    })
});

proj4.defs("EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");

var epsg = new ol.proj.Projection({
    code: "EPSG:32633"
});

var view = new ol.View({
    center: ol.proj.transform([17.9047990517937, 48.4608516791396], "EPSG:4326", epsg.getCode()),
    zoom: 8,
    projection: epsg
});

var map = new ol.Map({
    layers: [
        hranica
    ],
    target: "map",
    view: view
});
