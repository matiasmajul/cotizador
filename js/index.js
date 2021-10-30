// ------ INICIALIZACION DE VARIABLES ---------

const empresa = {lat: 25.892245, lng: -80.382963}; //LONGITUD Y LATITUD DE ROSARIO
function initMap() {
    let directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      disableDefaultUI: true,

      center: empresa,
      zoom: 10,
    });
    const marker = new google.maps.Marker({
      position: empresa,
      map: map,
    });
    new AutocompleteDirectionsHandler(map);

    //EVENTO CLICK DE BOTON COTIZAR
    document.getElementById("btn-cotizar").addEventListener("click",function(){  
      calcularDistancia(directionsService)
    })

  }
  
  class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;

    constructor(map) {
      this.map = map;
      this.originPlaceId = "";
      this.destinationPlaceId = "";
      this.travelMode = google.maps.TravelMode.DRIVING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(map);
      const originInput = document.getElementById("origen");
      const destinationInput = document.getElementById("destino");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);

      // Specify just the place data fields that you need.
      originAutocomplete.setFields(["place_id"]);
  
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
  
      // Specify just the place data fields that you need.
      destinationAutocomplete.setFields(["place_id"]);
      
      this.setupPlaceChangedListener(originAutocomplete, "ORIG");
      this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    }
    
    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      document.getElementById("btn-cotizar").addEventListener("click", () => {
        const place = autocomplete.getPlace();
  
        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }
  
        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
        } else {
          this.destinationPlaceId = place.place_id;
        }
  
        this.route();
      });
    }
    route() {

      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
  
      const me = this;
      let service = new google.maps.DistanceMatrixService();

      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
          mapTypeId: "roadmap",

        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );   
    }
    
}


function calcularDistancia(directionsService) {
    
    directionsService.route(
      {
          origin: document.getElementById("origen").value,
          destination: document.getElementById("destino").value,
          optimizeWaypoints: true,
          travelMode: "DRIVING",
      },
      function(response, status) { 
          let html= ""   ;
          switch (status) {
            case "OK":       // Si el mapa pudo resolver Origen y Destino
                    jQuery("#alert").hide();
                    jQuery("#btn-reservar").show();
       
                    let route = response.routes[0];
                    let finalDistance;
                    let precio = 0;
                    const precioKM = 30;   // <--- Precio por KM 

                    let distanceInMeters = route.legs[0].distance.value; 
                    let distanceInKm = distanceInMeters / 1000;
                    let distance = route.legs[0].distance.text; 
                    
                    precio = distanceInKm * precioKM;      

                    let extractNumber = distance.split(" "); // ["1,3", "km"]
                    let stringDistance = extractNumber[0]; // "1,3"
                   
                    if (stringDistance.includes(".")) {            // Si trae punto de mil, lo saca
                      finalDistance = stringDistance.replace(/\./g,'');                      
                    } else if (stringDistance.includes(",")){       // Si trae coma, (1,3km) la saca
                      finalDistance = parseFloat(
                        stringDistance
                          .replace(/,/g, ".")
                      );
                    } else {
                      finalDistance = parseFloat(stringDistance);  // String to Float
                    } 

                    let formatter = new Intl.NumberFormat('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                    });
                    


                    // PRECIO POR  TIPO DE CARGA
                    let tipoCarga = document.getElementById('tipo-carga').value;
                    switch (tipoCarga)
                    {
                        case "SECA":
                            precio*=1.1;
                            break;
                        case "REFRIGERADA":
                        precio*=2;
                        break;
                        case "PELIGROSA":
                            precio*=3;
                            break;
                        default:
                            alert("Verificar tipo de carga");
                            return 0;
                    }
                    precio = formatter.format(precio);  


                    document.getElementById("tiempo").innerText = route.legs[0].duration.text;
                    document.getElementById("distancia").innerText =finalDistance+ " Km";
                    document.getElementById("costo").innerText =precio ;

                  
                  break;
              case "NOT_FOUND":    // En caso que el mapa no resuelva la dirección ingresada
                    jQuery("#btn-reservar").hide();
                  jQuery("#alert").show();
                  let error =
                      html +
                      "<p>No se encuentra la dirección, por favor revise Origen y Destino</p>";
                  jQuery("#alert").html(error);
                  break;
              case "ZERO_RESULTS":
                  jQuery("#alert").show();
                  jQuery("#alert").html =
                      html +
                      "<p>No se encuentra la dirección, por favor revise Origen y Destino</p>";
                  break;
              case "REQUEST_DENIED":
                  jQuery("#alert").show();
                  jQuery("#alert").html =
                      html +
                      "the webpage is not allowed to use the directions service.";
                  break;
          }
      }
  );
}