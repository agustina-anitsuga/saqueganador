import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarComponent } from './star.component';
import { FormsModule } from '@angular/forms';
import { MultiplierComponent } from './multiplier.component';


@NgModule({
  declarations: [
    StarComponent,
    MultiplierComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    StarComponent,
    CommonModule,
    FormsModule,
    MultiplierComponent
  ]
})
export class SharedModule { }
