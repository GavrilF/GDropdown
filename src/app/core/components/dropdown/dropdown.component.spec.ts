import { Component, Directive, Input, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  //Fake InputField
  @Component({
    selector: 'app-input-field',
    template: '<div><div>'
  })
  class MockInputFieldComponent {
    @Input() ngModel: any
  }
  // Fake OptionsList
  @Component({
    selector: 'app-options-list',
    template: '<div><div>'
  })
  class MockOptionsListComponent {
    @Input() options: string[];
    @Input() selected: string;
    @Input() focused: string;
  }
  // Fake PopupDirective
  @Directive({
    selector: '[appPopup]'
  })
  class PopupDirective {
    @Input() templateRef: TemplateRef<HTMLElement>;
    @Input() adaptToElementWidth: boolean;
    @Input() useBoolToOpen: boolean;
    @Input() isOpen: boolean; 
  }

  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let OPTIONS: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownComponent, MockInputFieldComponent, MockOptionsListComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    OPTIONS = ['First', 'Second', 'Third', 'Fourth'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedOption properly', () => {
    component.selectedOption = 'First';

    expect(component.selectedOption).toBe('First');
  });

  it('should set inputField value when setting selectedOption', () => {
    component.selectedOption = 'First';

    expect(component.inputValue).toBe('First');
  });

  
});
