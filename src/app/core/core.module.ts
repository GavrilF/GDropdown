import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupDirective } from './directives/popup.directive';
import { PopupContainerComponent } from './components/popup-container/popup-container.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';



@NgModule({
  declarations: [DropdownComponent, PopupDirective, PopupContainerComponent, InputFieldComponent],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownComponent
  ]
})
export class CoreModule { }
