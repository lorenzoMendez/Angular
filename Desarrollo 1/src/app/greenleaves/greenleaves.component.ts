import { Component } from '@angular/core';
// Importar los servicios
import { RestService } from '../services/rest.service';
// Manejar validaciones
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Consumir servicios externos
import { HttpClient, HttpHeaders }from '@angular/common/http';

@Component( {
      selector: 'green-leaves',
      templateUrl: './greenleaves.component.html'
} )
// API Key
// &APPID=ceeaf2e0ddc243baacee1c6babfbcf76
export class GreenLeavesComponent {
      // Estado de la vista
      public status: boolean;
      public control: boolean;
      public loading: boolean;
      public perfilForm: FormGroup;
      public dataJson;
      public posicion;
      public error;
      public validaciones;
      public val: Array<string>;
      public mes;
      public clima;
      public climaStatus;
      public grados;

      constructor( public _rest: RestService, private formBuilder: FormBuilder ) {
            this.loading = false;
            this.status = false;
            this.control = false;
            this.posicion = null;
            this.clima = null;
            this.climaStatus = null;
            this.error = "";
            this.validaciones = [ "", "", "", "" ];
            this.val = new Array();
            this.mes = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
      }
      
      ngOnInit() {
            this.perfilForm = this.formBuilder.group( {
                  nombre: [ '', Validators.required ],
                  email: ['', Validators.required ],
                  telefono: ['', Validators.required ],
                  fecha: ['', Validators ],
                  fecha_formato: ['', Validators.required ]
            } );
            // Se obtiene primero la localizacion del usuario
            this.getLocalizacion();
      }

      // Comprueba si el formulario es válido
      onSubmit() {
            this.control = true;
            // Si el formulario no es válido
            if( this.perfilForm.invalid ) {
                  if( this.checkErrores() )
                        this.showModal();
                  return;
            }

            // HABLITE LAS SIGUIENTES DOS LINEAS PARA PRUEBAS
            //this.posicion = { 'lat': 17.861053, 'lon': -96.140240 };
            //this.error = "";

            // Checo si se obtuvo la posicion
            if( this.posicion == null ) {
                  // Hay errores
                  this.status = true;
                  this.loading = false;
                  return;
            }

            // Imagen de cargando
            this.loading = true;

            // Se hace la consulta
            this.getClima();

            // Esperar los dos segundos primero
            setTimeout( () => { this.cargaConsulta(); }, 2000 );
      }

      // Checa hasta que la API devuelva los resultados
      cargaConsulta() {
            // Si se consigue inf de la API
            if( this.climaStatus ){
                  this.status = true;
                  this.loading = false;
                  return;
            }
            // Volver a checar cada 500 milisegundos
            setTimeout( () => { this.cargaConsulta() }, 500 );
      }

      // Obtiene la geolocalizacion del usuario
      getLocalizacion() {
            if (navigator.geolocation) {
                  // Obtiene la ubicacion o maneja los errores
                  navigator.geolocation.getCurrentPosition(
                        // Obtiene posicion
                        ( position ) => {
                              this.posicion = {  
                                    'lat': position.coords.latitude,
                                    'lon': position.coords.longitude
                              };
                        },
                        // Si se produce un error reportarlo
                        ( error ) => {
                              switch( error.code ) {
                                    case error.PERMISSION_DENIED:
                                          this.error = "El usuario ha denegado la geolocalización."
                                          break;
                                    case error.POSITION_UNAVAILABLE:
                                          this.error = "La ubicacion no es válida."
                                          break;
                                    case error.TIMEOUT:
                                          this.error = "Tiempo de respuesta excedido."
                                          break;
                                    default:
                                          this.error = "Ocurrió un error desconocido."
                                          break;
                              }
                        }, { timeout:5000, enableHighAccuracy: true, maximumAge: 0 }
                  );
            } else {
                  alert("La geolocalización no es soportada por su navegador.");
            }
      }

      // Obtiene los constroles del formulario perfilForm
      get f() { return this.perfilForm.controls; }
      
      checkFecha() {
            if( this.perfilForm.get( 'fecha' ).value ) {
                  var fechaShow = document.getElementById( "fechaShow" );
                  var fechaSelect = document.getElementById( "fechaSelect" );
                  var aux = this.perfilForm.get( 'fecha' ).value.split( "-" );

                  if( this.validateFecha( aux[ 2 ], aux[ 1 ], aux[ 0 ] ) ) {
                        this.perfilForm.get( 'fecha_formato' ).setValue( aux[ 2 ] + " de " + this.mes[ aux[ 1 ] - 1 ] + " del " + aux[ 0 ] );
                        // display element
                        fechaShow.style.display = "block";
                        fechaSelect.style.display = "none";
                        // reset fecha
                        this.perfilForm.get( 'fecha' ).setValue( null );
                  }
            }
      }

      /**
       * @param ddd dia seleccionado
       * @param mmm mes seleccionado
       * @param yyyyy año seleccionado
       */
      validateFecha( ddd: number, mmm: number, yyyyy: number ): boolean {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; // el mes empieza en 0
            var yyyy = today.getFullYear();
            // considera meses con 30 dias
            // no considera años bisiestos
            var dif = dd - ddd + (mm - mmm ) * 30 + ( yyyy - yyyyy ) * 360;
            if( dif >= 0 && dif <= 36000 )
                  return true;
            return false;
      }

      // Evento cuando se despliega el calendario
      clickCalendario() {
            var fechaShow = document.getElementById( "fechaShow" );
            var fechaSelect = document.getElementById( "fechaSelect" );

            if( fechaSelect.style.display === "none" ) {
                  fechaSelect.style.display = "block";
                  fechaShow.style.display = "none";
            }
      }

      // Si no cumple con los patrones input
      checkErrores(): boolean {
            let i = 0;
            this.val = new Array();
            for( ; i < 4; ++i ) {
                  if( this.validaciones[ i ] != "" ) {
                        this.status = false;
                        this.val.push( this.validaciones[ i ] );
                  }
            }
            return this.val.length > 0 ? true : false;
      }

      // Consigue el clima
      getClima() {
            // Comprueba que se consiguió la ubicacion del suaurio
            if( this.posicion != null ) {
                  this._rest.getWeather( this.posicion.lat,this.posicion.lon ).subscribe( 
                        ( data: {} ) => {
                              this.clima = data;
                              this.climaStatus = true;
                              this.convertirClima();
                        }
                   );
            }
      }

      // Convierte climas Kelvin a Grados Centigrados
      convertirClima() {
            this.grados = this.clima.main.temp - 273.15;
      }

      // Muestra el modal con los errores
      showModal() {
            var modal = document.getElementById('myModal');
            var span = document.getElementById("close");
            var buttonclose = document.getElementById("button-close");

            // Mostrar el modal
            modal.style.display = "block";

            span.onclick = function() {
                  modal.style.display = "none";
            }

            buttonclose.onclick = function(){
                  modal.style.display = "none";
            }

            // Cerrar modal con clic fuera del elemento
            window.onclick = function(event) {
                  if (event.target == modal)
                        modal.style.display = "none";
            }
      }
}