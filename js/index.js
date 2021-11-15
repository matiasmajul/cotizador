// ------ INICIALIZACION DE VARIABLES ---------
const URL = "https://matiasmajul.github.io/cotizador/data.json";


function initMap() {

  $.getJSON(URL, function(respuesta,estado){
    if(estado === "success")
    {
      //Guardo 
      let direccion={
        lat: Number(respuesta.lat),
        lng: Number(respuesta.lng)
      }

      const map = new google.maps.Map(document.getElementById("map"), {
        disableDefaultUI: true,
        center: direccion,
        zoom: 12,
      });
    
      new AutocompleteDirectionsHandler(map);
    }

  })


    let directionsService = new google.maps.DirectionsService();
    //EVENTO CLICK DE BOTON COTIZAR
    document.getElementById("btn-cotizar").addEventListener("click",function(){  
      calcularDistancia(directionsService)
    });

    limpiarInput();

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

              $('.muestra').animate({   top:'-5%',
                                        opacity:'1',
                                        
                                          }, //1er parámetro propiedades
                                        2500,            //2do parámetro duración 
                                        almacenarLocalStorage(response)

              );
            
              setTimeout(reservar,2000);

              break;
            case "NOT_FOUND":    // En caso que el mapa no resuelva la dirección ingresada
              mostrarError("DIRECCIÓN NO ENCONTRADA",`No se encuentra la dirección, por favor revise "${origen.value}" o "${destino.value} y seleccione una opción de la lista."`);
              break;
            case "ZERO_RESULTS":
              mostrarError("DIRECCIÓN EXCEDIDA",`Distancia no permitida.`);
              break;
            case "REQUEST_DENIED":
              mostrarError("SOLICITUD NO ENCONTRADA",`Error al realizar solicitud.`);
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

function limpiarInput()
{
  $('#origen').on("change",()=>{
    $('#clean-origen').show()
  })
  $('#destino').on("change",()=>{
    $('#clean-destino').show()
  })

  $('#clean-origen').click(()=>{
    $('#origen').val(" ")
    $('#clean-origen').hide();
  })
  $('#clean-destino').click(()=>{
    $('#destino').val(" ")
    $('#clean-destino').hide();
  })

}
