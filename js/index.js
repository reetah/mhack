var launch = function() {
    console.log("let's do this!");
}
var selected = [];
var forecast;
var getForecast = function(state, airport) {
    $.ajax({
        url: "http://api.wunderground.com/api/6a636cdd571ca60f/forecast/q/" + state + "/" + airport + ".json",
        dataType: "jsonp",
        success: function(parsed_json) {
            console.log(parsed_json);
            forecast = parsed_json;
            var lowF = parsed_json.forecast.simpleforecast.forecastday[0].low.fahrenheit;
            var highF = parsed_json.forecast.simpleforecast.forecastday[0].high.fahrenheit;
            //alert("Today has a low of " + lowF + "  F and a high of " + highF + " F.");
        }
    });
}

var getWeather = function(state, airport) {
    $.ajax({
        url: "http://api.wunderground.com/api/6a636cdd571ca60f/geolookup/conditions/q/" + state + "/" + airport + ".json",
        dataType: "jsonp",
        success: function(parsed_json) {
            var location = parsed_json['location']['city'];
            var temp_f = parsed_json['current_observation']['temp_f'];
            alert("Current temperature in " + location + " is: " + temp_f + " F.");
        }
    });
}
var station;

var getStation = function(lat, lan) {
    $.ajax({
        url: "http://api.wunderground.com/api/6a636cdd571ca60f/geolookup/q/" + lat + "," + lan + ".json",
        dataType: "jsonp",
        success: function(parsed_json) {
            console.log(parsed_json);
            station = parsed_json;
            wanted = station.location.nearby_weather_stations.airport.station[0];
            $("#location_text").val(wanted.city + ", " + wanted.state);

            getWeather(wanted.state, wanted.city);
            getForecast(wanted.state, wanted.city);
        }
    });
}




//google map part


// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var posi;

function initialize() {
    var mapOptions = {
        zoom: 6
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
            });
            console.log(pos);
            posi = pos;
            map.setCenter(pos);
            //getStation(pos.d, pos.e);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);

var typeData;
var closet;
$(document).ready(function() {
    $.getJSON("data/type.json", function(data) {
        //console.log(data);
        typeData = data;
        loadCategories(typeData);
        dropLoadCat();
        dropLoadType("top");
        dropLoadSubtype("jacket");
    });


    $.getJSON("http://localhost:8000/api/clothing/?limit=0", function(data) {
        console.log(data);

        closet = data.objects;
        loadCloset(closet);

    });


    $(document).on('click', '.cloth', function(e) {
        e.preventDefault();
        //console.log($(this)[0].id);
        toggleCloth($(this)[0].id);
        $("#" + $(this)[0].id).toggleClass("selected");
    });
});




var loadCategories = function(typeData) {
    console.log(typeData);
    for (var i = 0; i < typeData.length; i++) {
        $("#categories").append("<div class='category' onclick='loadType(\"" + typeData[i].label + "\");'>" + typeData[i].label + "</div>")
    }

    $(".category").css("width", "calc(" + 1 / typeData.length * 100 + "% - 2px");


}

var currentType;

var loadType = function(type) {
    console.log(type);

    //console.log(typeData);
    for (var i = 0; i < typeData.length; i++) {
        if (typeData[i].label == type) {
            currentType = typeData[i];
            console.log(currentType);
            break;
        }
    }
    $("#types").html("");
    for (var i = 0; i < currentType.type.length; i++) {
        $("#types").append("<div class = 'type' onclick='loadSubtype(\"" + currentType.type[i].label + "\");'>" + currentType.type[i].label + "</div>")
    }

    $(".type").css("width", "calc(" + 1 / currentType.type.length * 100 + "% - 2px");
    $("#subtypes").html("");
}

var loadSubtype = function(subType) {
    var currentSubTypes;
    console.log(subType);
    for (var i = 0; i < currentType.type.length; i++) {
        if (subType == currentType.type[i].label) {
            currentSubTypes = currentType.type[i].subtypes;
            console.log(currentSubTypes);
            break;
        }
    }
    $("#subtypes").html("");
    //          console.log(currentSubTypes[0].label);
    for (var i = 0; i < currentSubTypes.length; i++) {
        $("#subtypes").append("<div class = 'subtype' onclick = 'loadClothes(\"" + currentSubTypes[i].label + "\");'>" + currentSubTypes[i].label + "</div>")
    }
    $(".subtype").css("width", "calc(" + 1 / currentSubTypes.length * 100 + "% - 2px");
    $(".subtype").css("font-size", 600 / currentSubTypes.length + "% ");
}

var loadClothes = function(subtype) {
    console.log(subtype);
}


var loadCloset = function(closet) {
    console.log(closet);
    for (var i = 0; i < closet.length; i++) {
        $("#selection").append("<div class='cloth' id='" + closet[i].id + "'style='background-image:url(" + closet[i].picURL + ")'></div>");

    }
}

var showAdd = function() {
    $("#modal").slideDown();
}


var addThis = function() {
    console.log("add this cloth");

    var item = {};
    item.brand = $("#brand").val();
    item.category = $("#select1").val();
    item.colour = $("#color").val();
    item.generalType = $("#select2").val();
    item.name = $("#brand").val() + " " + $("#color").val() + " " + $("#select3").val();
    item.picURL = $("#picURL").val();
    item.subType = $("#select3").val();
    item.weatherIndex = 1;

    $.ajax({
        url: 'http://localhost:8000/api/clothing/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(item),
        dataType: 'json',
        processData: false,
        statusCode: {
            201: function() {
                //console.log(data);
                $("#modal").slideUp();
                $.getJSON("http://localhost:8000/api/clothing/?limit=0", function(data) {
                    console.log(data);

                    closet = data.objects;
                    loadCloset(closet);

                });
            }
        }



    });

}


var selection;

var selectionChange = function() {
    selection = $("#select1").val();
    // 'dropLoadType(" + typeData[i].label + ");'
    dropLoadType(selection);
}

var dropLoadCat = function() {
    for (var i = 0; i < typeData.length; i++) {
        $("#select1").append("<option value=\"" + typeData[i].label + "\">" + typeData[i].label + "</option>")
    }
    // $("#select1").html("");                                                                    
}
var currentType;
var dropLoadType = function(type) {
    console.log('dropLoadType worked');
    // type = bottom
    // console.log(typeData.length);
    console.log('typeData[0]' + typeData[0]);
    // console.log(type);
    for (var i = 0; i < typeData.length; i++) {
        if (typeData[i].label == type) {
            //          console.log(typeData[i].label);
            currentType = typeData[i];
            break;

        }
    }
    console.log(currentType);
    $("#select2").html("");
    for (var i = 0; i < currentType.type.length; i++) {
        $("#select2").append("<option value=\"" + currentType.type[i].label + "\">" + currentType.type[i].label + "</option>");
    }

}

var selectionChangeType = function(subtype) {
    selection = $("#select2").val();
    dropLoadSubtype(selection);
}

var dropLoadSubtype = function(type) {
    var currentSubType;
    for (var i = 0; i < currentType.type.length; i++) {
        if (currentType.type[i].label == type) {
            currentSubType = currentType.type[i].subtypes;
            console.log(currentType);
            break;
        }
    }
    $("#select3").html("");
    for (var i = 0; i < currentSubType.length; i++) {
        $("#select3").append("<option value=\"" + currentSubType[i].label + "\">" + currentSubType[i].label + "</option>");
    }
}


var toggleCloth = function(clothID) {
    console.log(clothID);
    if (selected.indexOf(clothID) == -1) {
        selected.push(clothID);
    } else {
        selected.splice(selected.indexOf(clothID), 1);
    }
    $("#top").html("");
    $("#bottom").html("");
    $("#feet").html("");
    for (var i = 0; i < closet.length; i++) {
        if (selected.indexOf(closet[i].id.toString()) != -1) { //cloth selected{
            if (closet[i].category == "top") {
                $("#top").append("<div>" + closet[i].name + "</div>")
            }
            if (closet[i].category == "bottom") {
                $("#bottom").append("<div>" + closet[i].name + "</div>")
            }
            if (closet[i].category == "feet") {
                $("#feet").append("<div>" + closet[i].name + "</div>")
            }
        }
    }


}