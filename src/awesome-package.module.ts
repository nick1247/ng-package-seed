import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AwesomePackageComponent } from './awesome-package.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AwesomePackageComponent
    ],
    providers: [
    ],
    exports: [
        AwesomePackageComponent
    ]
})
export class AwesomePackageModule { }