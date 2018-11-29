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

export class GreenLeavesComponent {
      // Estado de la vista
      public status: boolean = false;
      public control: boolean = false;
      public perfilForm: FormGroup;
      public dataJson;
      public validaciones = [ "", "", "", "" ];
      public val: Array<string> = new Array();
      public mes = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];

      constructor( public _rest: RestService, private formBuilder: FormBuilder ) {}
      
      ngOnInit() {
            this.perfilForm = this.formBuilder.group( {
                  nombre: [ '', Validators.required ],
                  email: ['', Validators.required ],
                  telefono: ['', Validators.required ],
                  fecha: ['', Validators ],
                  fecha_formato: ['', Validators.required ]
            } );
      }

      get f() { return this.perfilForm.controls; }
      
      checkFecha() {
            if( this.perfilForm.get( 'fecha' ).value )
            {
                  var fechaShow = document.getElementById( "fechaShow" );
                  var fechaSelect = document.getElementById( "fechaSelect" );
                  var aux = this.perfilForm.get( 'fecha' ).value.split( "-" );

                  if( this.validateFecha( aux[ 2 ],aux[ 1 ], aux[ 0 ] ) ){

                        this.perfilForm.get( 'fecha_formato' ).setValue( aux[ 2 ] + "-" + this.mes[ aux[ 1 ] - 1 ] + "-" + aux[ 0 ] );
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
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            // Solo considero meses con 30 dias
            // no considera años bisiestos
            var dif = dd - ddd + (mm - mmm ) * 30 + ( yyyy - yyyyy )*360;
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
      
      // Comprueba si el formulario es válido
      onSubmit() {
            this.control = true;
            // Si el formulario no es válido
            if( this.perfilForm.invalid ) {
                  if( this.checkErrores() )
                        this.showModal();
                  return;
            }

            this.status=true; 
      }

      // Muestra el modal con los errores
      showModal() {
            var modal = document.getElementById('myModal');
            var span = document.getElementById("close");
            var buttonclose = document.getElementById("button-close");
            
            span.onclick = function() {
                  modal.style.display = "none";
            }

            buttonclose.onclick = function(){
                  modal.style.display = "none";
            }

            modal.style.display = "block";

            window.onclick = function(event) {
                  if (event.target == modal)
                        modal.style.display = "none";
            }
      }
}