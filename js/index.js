// ------ INICIALIZACION DE VARIABLES ---------

const empresa = {lat: 25.892245, lng: -80.382963}; //LONGITUD Y LATITUD

function initMap() {
    let directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      disableDefaultUI: true,
      center: empresa,
      zoom: 10,
    });
    
    new AutocompleteDirectionsHandler(map);

    //EVENTO CLICK DE BOTON COTIZAR
    document.getElementById("btn-cotizar").addEventListener("click",function(){  
      calcularDistancia(directionsService)
    })
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
      
          switch (status) {
            case "OK":       // Si el mapa pudo resolver Origen y Destino 
              let route = response.routes[0];

              let distanceInMeters = route.legs[0].distance.value; 
              let distanceInKm = distanceInMeters / 1000;
              let distance = route.legs[0].distance.text; 
              
              document.getElementById("tiempo").innerText = route.legs[0].duration.text;
              document.getElementById("distancia").innerText =distance;
              document.getElementById("costo").innerText =obtenerPrecio(distanceInKm) ;

              almacenarLocalStorage(response);
              
              setTimeout(reservar,2000);

              break;
            case "NOT_FOUND":    // En caso que el mapa no resuelva la dirección ingresada
              mostrarError("DIRECCION NO ENCONTRADA",`No se encuentra la dirección, por favor revise "${origen.value}" o "${destino.value}"`);
              break;
            case "ZERO_RESULTS":
              mostrarError("DIRECCION EXCEDIDA",`Distancia no permitida`);
              break;
            case "REQUEST_DENIED":
              mostrarError("SOLICITUD NO ENCONTRADA",`Error al realizar solicitud`);
              break;
          }
      }
  );
}


function obtenerPrecio(distancia){
  const precioKM = 30;   // <--- Precio por KM 

  let formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    });

  let precio = distancia * precioKM;      
    
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

  return precio;
}



function mostrarError(titulo,mensaje){
  Swal.fire({
    icon: 'error',
    title: titulo,
    html: mensaje,
    timer: 4000,
    timerProgressBar: true,
  })
}

function reservar(){
  Swal.fire({
    icon: 'question',
    title: '¿Reservar transporte?',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Reservar',
    input: 'email',
    inputLabel: 'Correo electrónico',
    inputPlaceholder: 'Ingresá tu dirección de correo'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Enviado!',
        'Revisa tu casilla de correo',
        'success'
      )
    }
  })
}


function almacenarLocalStorage(response)
{ 
  let route = response.routes[0];

  let distanceInMeters = route.legs[0].distance.value; 
  let distanceInKm = distanceInMeters / 1000;
  let distance = route.legs[0].distance.text; 

  const datosEnStorage = [{
    origen:route.legs[0].end_address,
    destino: route.legs[0].start_address,
    distancia: distance, 
    precio:obtenerPrecio(distanceInKm)
  }];

   localStorage.setItem("viajes", JSON.stringify(datosEnStorage));
  
}