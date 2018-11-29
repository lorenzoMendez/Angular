import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Permite trabajar con todas las directivas ngModule
import { HttpModule } from '@angular/http';

// Nos permmitira trabajar con Two Way Data Binding
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

// Cliente Http
import { HttpClientModule } from '@angular/common/http';

// Importar el componente greenleaves
import {  GreenLeavesComponent } from './greenleaves/greenleaves.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    GreenLeavesComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
