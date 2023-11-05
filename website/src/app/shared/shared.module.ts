import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert.component';
import { Alert } from './alert.model';


@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    AlertComponent
  ]
})
export class SharedModule { }