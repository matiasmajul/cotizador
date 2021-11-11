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

      const options = {
        componentRestrictions: { country: "AR" },  
      };
      const originInput = document.getElementById("origen");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput, options);
      originAutocomplete.setFields(["place_id"]);
      this.setupPlaceChangedListener(originAutocomplete, "ORIG");

      const destinationInput = document.getElementById("destino");
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, options);
      destinationAutocomplete.setFields(["place_id"]);
      this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    }
    
    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      document.getElementById("btn-cotizar").addEventListener("click", () => {
        const place = autocomplete.getPlace();
        if (!place) {
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
      this.directionsService.route({
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } 
        }
      );   
    }
    
}