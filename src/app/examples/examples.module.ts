import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownExampleComponent } from './dropdown-example/dropdown-example.component';
import { CoreModule } from '../core/core.module';



@NgModule({
  declarations: [DropdownExampleComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    DropdownExampleComponent
  ]
})
export class ExamplesModule { }
