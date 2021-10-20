/*--------- FUNCIONES ---------------*/

// FUNCION PARA VALIDAR PESO EN TONELADAS 
function pesoValido(peso) {
    do
    {
        if (peso<=0 || peso>45 )
        {
            alert("Ingrese peso válido!");
            peso = Number(prompt("Ingrese peso de carga en toneladas, minimo 1 - máximo 45"));
        }
        else
        {
            return peso;
        }       
    }while(true)
}

//  FUNCION PARA SUMAR IVA
const agregarIva = x => (x * 1.21).toFixed(1);

// FUNCION PARA ORDENAR OBJETO
function compararDistancia(a, b) {
    if (a.distancia > b.distancia) {
      return 1;
    }
    if (a.distancia < b.distancia) {
      return -1;
    }
    return 0;
  };


  // FUNCION COTIZA
function cotizar()
{
    let viajes = [];
    let distancia;
    let peso
    do
    {
        distancia = Number(prompt("Ingrese distancia en KM: "));
        peso = Number(prompt("Ingrese peso de carga en toneladas"));
        peso = pesoValido(peso);
    
        // CREO OBJETO CON TIPO DE VEHICULO PREDEFINIDO
        const viaje = new Viaje(distancia,peso,camiones[2]);
    
        //AGREGO OBJETO AL ARRAY
        viajes.push(viaje);
    
        let salida= prompt("Seguir cotizando o ESC para salir").toUpperCase();
        if(salida == "ESC") break;
    
    }while(true)
    
    viajes.sort(compararDistancia);
    viajes.forEach(viaje => viaje.mostrarCosto());
    viajes.forEach(viaje => viaje.mostrarCostoDolar());
}
/*--------------- CLASES-------------------*/

// CLASE PARA OBTENER VALOR  CAMBIARIO
class Peso{
    constructor(cotizacionDolar)
    {
        this.cotizacionDolar=cotizacionDolar;
    }

    // ---------- METODOS -------------
    cambioDolar(pesos)
    {
        return pesos / this.cotizacionDolar;
    } 
    cambioPeso(dolar) 
    {
       return dolar * this.cotizacionDolar;
    }

}

// CLASE VEHICULO DONDE COSTO DE SEGUN TIPO DE CAMION, CARGA, COMBUSTIBLE Y CHOFER
class Vehiculo{
    constructor(tipo, carga, combustible, conductor)
    {
        // UPPERCASE PARA FACILITAR  VALIDACION
        this.tipo= tipo.toUpperCase();
        this.carga=carga.toUpperCase();

        
        this.costoCombustible = combustible;
        this.costoConductor = conductor;

    }

     // FUNCION PARA DETERMINAR EL COSTO SEGUN TIPO DE CAMION Y TIPO DE CARGA
    costoVehiculo(){
        let costo;
        switch (this.carga)
        {
            case "FRIA":
                switch (this.tipo)
                {
                    case "ISOTERMICO":
                        costo=2.1;
                        break;
                    case "REFRIGERADO":
                        costo = 2.0;
                        break;
                    case "FRIGORIFICO":
                        costo = 2.2;
                        break;
                    default:
                        alert("Verificar tipo de camión o carga ");
                        costo = 0;                 
                }
                break;
            case "SECA":
                switch (this.tipo)
                {
                    case "CONTENEDOR":
                        costo=1.1;
                        break;
                    case "JAULA":
                        costo = 1.5;
                        break;
                    case "LONA":
                        costo = 1.2;
                        break;
                    default:
                        alert("Verificar tipo de camión o carga ");
                        costo = 0;                 
                }
                break;
            case "PELIGROSA":
                costo=3;
                break;
            default:
                alert("Verificar tipo de carga");
                costo=0;
        }
        costo += this.costoCombustible +this.costoConductor;
        return costo;

    }
}

class Viaje{
    constructor(distancia, peso, camion)
    {
        this.distancia = distancia;
        this.peso = peso;
        this.camion = camion;
    }

    // ---------- METODOS -------------
    costoTransporte()
    {
        let costoTotalTransporte = this.distancia * this.peso * this.camion.costoVehiculo(); 
        return costoTotalTransporte.toFixed(1);
    }

    mostrarCosto() 
    {    
        let costo= this.costoTransporte();
        let textoCosto = document.createElement("p");
        textoCosto.innerText="Costo de transportar "+this.peso+" toneladas de carga "+ this.camion.carga + " en " +this.distancia+" km: $" + costo;

        const contenedor = document.getElementById("container");
        contenedor.appendChild(textoCosto);
        
        console.log("Costo de transportar "+this.peso+" toneladas de carga "+ this.camion.carga + " en " +this.distancia+" km: $" + costo );
        console.log("Costo de transporte con IVA: $" + (agregarIva(costo)));
    }
    
    mostrarCostoDolar() 
    { 
        let costoUSD = pesoValorBlue.cambioDolar(this.costoTransporte()).toFixed(1);
        let textoCosto = document.createElement("p");
        textoCosto.innerText="Costo de transportar "+this.peso+" toneladas en "+this.distancia+" km: " + costoUSD +" USD";

        const contenedor = document.getElementById("container");
        contenedor.appendChild(textoCosto);

        console.log("Costo de transportar "+this.peso+" toneladas en "+this.distancia+" km: " + costoUSD +" USD")
    }
      
}


// ------ INICIALIZACION DE VARIABLES ---------

const pesoValorBlue = new Peso(187);
const camiones = [new Vehiculo("ISOTERMICO","FRIA",1.1,1.2), new Vehiculo("JAULA","SECA",1,0.8), new Vehiculo("peligrosa","peligrosa",2,2)];





$("#boton_obtenerTodos").click(function () {
    $.ajax({
     type: "GET",
     url: "http://localhost:55987/api/Empleados",
     contentType: "application/json; charset=utf-8",
     dataType: "json",
     success: function (data) {
      $('#Table > tbody').empty();
      $.each(data, function (i, item) {
      var rows = 
      "" +
      "" + item.id + "" +
      "" + item.Nombres + "" +
      "" + item.Cargo + "" +
      "" + item.Dpto + "" +
      "";
      $('#Table > tbody').append(rows);
      });
      console.log(data);
     },
     failure: function (data) {
      alert(data.responseText);
     },
     error: function (data) {
      alert(data.responseText);
     }
    });
    });