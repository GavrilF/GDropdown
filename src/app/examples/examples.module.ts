import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownExampleComponent } from '../dropdown-example/dropdown-example.component';



@NgModule({
  declarations: [DropdownExampleComponent],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownExampleComponent
  ]
})
export class ExamplesModule { }
