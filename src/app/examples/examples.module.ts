import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownExampleComponent } from './dropdown-example/dropdown-example.component';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DropdownExampleComponent],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DropdownExampleComponent
  ]
})
export class ExamplesModule { }
