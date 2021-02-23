import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OptionComponent } from '../option/option.component';

import { OptionsListComponent } from './options-list.component';

describe('OptionsListComponent', () => {
  let component: OptionsListComponent;
  let fixture: ComponentFixture<OptionsListComponent>;
  let OPTIONS: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsListComponent, OptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsListComponent);
    component = fixture.componentInstance;
    OPTIONS = ['First', 'Second', 'Third', 'Fourth'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render each option as OptionComponent', () => {
    component.options = OPTIONS;
    fixture.detectChanges();

    const optionComponentsDEs = fixture.debugElement.queryAll(By.directive(OptionComponent));
    expect(optionComponentsDEs.length).toEqual(4);
  })

  it('should get isSelected', () => {
    component.options = OPTIONS;
    component.selected = OPTIONS[0];
    fixture.detectChanges();

    expect(component.isSelected(OPTIONS[0])).toBeTrue();
  })

  it('should get isFocused', () => {
    component.options = OPTIONS;
    component.focused = OPTIONS[0];
    fixture.detectChanges();

    expect(component.isFocused(OPTIONS[0])).toBeTrue();
  });

  it('should emit selectedOption', () => {
    spyOn(component.optionChange, 'emit');
    component.options = OPTIONS;
    fixture.detectChanges();

    const firstOptionComponent= fixture.debugElement.queryAll(By.directive(OptionComponent))[0];
    firstOptionComponent.triggerEventHandler('click', {});

    expect(component.optionChange.emit).toHaveBeenCalledWith(OPTIONS[0]);
  })
});
