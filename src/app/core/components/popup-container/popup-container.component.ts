import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup-container',
  templateUrl: './popup-container.component.html',
  styleUrls: ['./popup-container.component.scss'],
})
export class PopupContainerComponent implements OnInit {
  @ViewChild('popupContainer') popupContainer: ElementRef<HTMLElement>;

  templateRef: TemplateRef<HTMLElement>;
  templateOutletContext: object;
  directiveElementRef: ElementRef<HTMLElement>;
  visible: boolean;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  /**
   * Show the popup container
   */
  show() {
    this.visible = true;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Hide the popup container
   */
  hide() {
    if(this.visible === true){
      this.visible = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * This method sets what popup content will be showed
   * @param obj Incoming instance from the popup directive
   */
  updatePopupContent(obj: {templateRef:TemplateRef<HTMLElement>,templateOutletContext: object,directiveElementRef: ElementRef<HTMLElement>}) {
    this.templateRef = obj.templateRef;
    this.templateOutletContext = obj.templateOutletContext;
    this.directiveElementRef = obj.directiveElementRef;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Shorthand that is used in the popup directive
   */
  getCurrentPopupElementRef(){
    return this.popupContainer.nativeElement;
  }

}
