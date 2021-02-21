import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupDirective } from './directives/popup.directive';
import { PopupContainerComponent } from './components/popup-container/popup-container.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionComponent } from './components/option/option.component';
import { OptionsListComponent } from './components/options-list/options-list.component';



@NgModule({
  declarations: [DropdownComponent, PopupDirective, PopupContainerComponent, InputFieldComponent, OptionComponent, OptionsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DropdownComponent
  ]
})
export class CoreModule { }
