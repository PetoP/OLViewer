// objekt na uchovávanie a vypisovanie informácií do lišty
var trayInfo = {

    // pozícia kurzora
    position_: [0, 0],

    // json data
    jsonData_: null,

    // json nahratý
    jsonLoaded_: false,

    // poradové číslo scény v liste
    sceneId_: 0,

    // vypíše pozíciu kurzora
    printCoordinates: function() {
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

    // nastaví pozíciu kurzora
    setPosition: function(position) {
        this.position_ = position;
        this.printCoordinates();
    },

    // nastavý jsonData
    setJsonData: function(data) {
        this.jsonData_ = data;
        this.jsonLoaded_ = true;
        this.setScene(data.snimky.length - 1);
    },

    // váráti súčasnú scény
    getScene: function() {
        return this.jsonData_.snimky[this.sceneId_];
    },

    // nastaví novú scénu
    changeSceneData: function() {
        document.getElementById("sucasnyDatumText").innerHTML = this.getScene().date;
        XYZSource.setUrl(this.getScene().RGBurl + "{z}/{x}/{-y}.png");
        map.renderSync();
    },

    // vyberie poslednú scénu
    setScene: function(id) {
        this.sceneId_ = id;
        this.changeSceneData();
        document.getElementById("datumViacTlac").style.color = "#717171";
    },

    // uber dátum
    dateBack: function() {
        if (this.sceneId_ - 1 >= 0) {
            this.sceneId_--;
            this.changeSceneData();
            document.getElementById("datumViacTlac").style.color = "white";
        }

        if (this.sceneId_ == 0) {
            document.getElementById("datumMenejTlac").style.color = "#717171";
        }
    },

    // pridaj dátum
    dateForward: function() {
        if (this.jsonLoaded_ && this.sceneId_ + 1 < this.jsonData_.snimky.length) {
            this.sceneId_++;
            this.changeSceneData();
            document.getElementById("datumMenejTlac").style.color = "white";
        }

        if (this.jsonLoaded_ && this.sceneId_ + 1 == this.jsonData_.snimky.length) {
            document.getElementById("datumViacTlac").style.color = "#717171";
        }
    }


};

trayInfo.printCoordinates();

// zobrazovanie súradníc
map.on("pointermove", function(e) {
    trayInfo.setPosition(ol.proj.transform(map.getCoordinateFromPixel(e.pixel), view.getProjection(), "EPSG:4326"));
});

// funkcie zoomovacích tlačítiek
document.getElementById("zoomin").onclick = function() {
    view.animate({
        zoom: view.getZoom() + 1,
        duration: 250
    });
};
document.getElementById("zoomout").onclick = function() {
    view.animate({
        zoom: view.getZoom() - 1,
        duration: 250
    });
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

// čítanie json-u s údajmi o rastroch
$.getJSON("./data/snimky.json", function(data) {
    trayInfo.setJsonData(data);
})
    .fail(function() {
        alert("Unable to read ./data/snimky.json!");
    });

// nastavovanie dátumu
document.getElementById("datumMenejTlac").onclick = function() {
    trayInfo.dateBack();
};
document.getElementById("datumViacTlac").onclick = function() {
    trayInfo.dateForward();
};
