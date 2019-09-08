// Map Init
var map;

getResult();

var suburb = [];
var people = [];
var lastPos = null;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -27.46794, lng: 153.02809 },
    zoom: 8
  });
  var geocoder = new google.maps.Geocoder();
  map.data.loadGeoJson(
    "https://data.gov.au/geoserver/qld-suburb-locality-boundaries-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_6bedcb55_1b1f_457b_b092_58e88952e9f0&outputFormat=json"
  );
  map.data.addListener("click", function(event) {
    if (lastPos != null) {
      map.data.overrideStyle(lastPos.feature, { fillColor: "#C7B2B2" });
    }
    map.data.overrideStyle(event.feature, { fillColor: "red" });
    lastPos = event;

    geocodeLatLng(geocoder, event.latLng.lat(), event.latLng.lng());
  });
  map.data.setStyle({
    fillColor: "#C7B2B2",
    strokeWeight: 0.6
  });
}

// get the name of the suburb
function geocodeLatLng(geocoder, lat, long) {
  var latlng = { lat: lat, lng: long };
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === "OK") {
      if (results[0]) {
        let arrRes = [];
        let res = arrRes.push(results[0].formatted_address.split(",")[1]);

        document.querySelector(".surburb").textContent = arrRes[0];
        //Following data are hard coded based on statistics published by ABS
        document.querySelector(".unemploy").textContent = "6.1%";
        document.querySelector(".age").textContent = "37.2";
        document.querySelector(".sex").textContent = "98.3";
        document.querySelector(".income").textContent = "1575.6";
        document.querySelector(".industry").textContent = "Education/Tourism";

        var sub = arrRes[0].split(" ")[1];
        //console.log(sub);
        suburb.forEach(function(element) {
          if (element.includes(sub)) {
            //console.log(suburb.indexOf(element));
            // console.log(element);
            // console.log(suburb.indexOf(element) + 1);
            document.querySelector(".population").textContent =
              suburb.indexOf(element) + 1;
            return true;
          }
        });

        console.log(arrRes[0]);
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}

function getResult() {
  const fetchPromise = fetch("population.json");
  fetchPromise
    .then(response => {
      return response.json();
    })
    .then(people => {
      var result = JSON.stringify(people);
      var resultArray = result.substr(1572).split("]"); //Start of the brackets e.g. data ignoring the header

      // resultArray.map

      var tmpsuburb = [];
      //var tmppeople = [];

      resultArray.forEach(function(element) {
        // console.log(element);
        var subArray = element.split(",");
        // console.log(subArray);
        tmpsuburb.push(subArray[2]);
        tmpsuburb.push(subArray[subArray.length - 1]);
        // console.log(subArray[2]);
        // console.log(subArray[subArray.length - 1]);
      });

      suburb = tmpsuburb;
      //people = tmppeople;
      // console.log(suburb.length);
      // console.log(people.length);

      // console.log(people);

      //people => (jsonFile = JSON.parse(people));
      //console.log(people);
    });
}
