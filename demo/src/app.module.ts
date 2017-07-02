import { NgModule } from '@angular/core';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { BrowserModule  } from '@angular/platform-browser';

import { AwesomePackageModule } from '../../index';

import { AppComponent } from './app.component';


@NgModule({
    imports: [
        BrowserModule, 
        BrowserAnimationsModule,
        AwesomePackageModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
    ]
})
export class AppModule { }