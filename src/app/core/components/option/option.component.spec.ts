import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionComponent } from './option.component';

describe('OptionComponent', () => {
  let component: OptionComponent;
  let fixture: ComponentFixture<OptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  })

  it('should have class selected', () => {
    component.selected = true;
    fixture.detectChanges();
    
    const optionContainerElem = fixture.nativeElement.querySelector('div');
    
    expect(optionContainerElem).toHaveClass('selected-option');
  });

  it('should have class focused', () => {
    component.focused = true;
    fixture.detectChanges();
    
    const optionContainerElem = fixture.nativeElement.querySelector('div');
    
    expect(optionContainerElem).toHaveClass('focused-option');
  });
});
