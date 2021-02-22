import { ApplicationRef, ComponentRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupContainerComponent } from '../components/popup-container/popup-container.component';
import { DynamicComponentsService } from '../services/dynamic-components.service';
import { WindowEventsEmitterService } from '../services/window-events-emitter.service';

@Directive({
  selector: '[appPopup]'
})
export class PopupDirective implements OnChanges {

  /**
   * Template to be rendered
   */
  @Input() templateRef: TemplateRef<HTMLElement>;

  /**
   * Use that in case of outlet context related to the template.
   */
  @Input() templateOutletContext: object;

  /**
   * This boolean represents if the popup should be closed on click within.
   */
  @Input() closeUponClick: boolean;

  /**
   * If true, will set the popup width to be equal to the element that directive has been append to.
   */
  @Input() adaptToElementWidth: boolean;

  /**
   * Postion to set if the element should be above or beneath the element that the directive has been append to.
   */
  @Input() initialPositionY: 'top' | 'bottom' = 'bottom';

  /**
   * We are going to use this when we want to manually trigger the popup state.
   */
  @Input() useBoolToOpen: boolean = false;

  /**
   * State of the popup in case this.useBoolToOpen is true
   */
  @Input() isOpen: boolean = false; 

  /**
   * Emits the state of the popup if it is opened or closed 
   * false => close
   * open => true
   */
  @Output() popupToggled: EventEmitter<boolean> = new EventEmitter();

  /**
   * The cointer that the popup directives will pass the templateRefs to
   * We are going to create that container component to be Singleton(ish) meaning it will have only one instance and all of the directives will be pointed to it
   */
  static popupContainerComponentRef: ComponentRef<PopupContainerComponent>;

  /**
   * We dont want to Listen for window/document click when the popup is not opened, so the better approach is to listen only when popup is opened
   */
  private _clickOutEventSubscription: Subscription;

  constructor(
    private readonly dynamicComponentsService: DynamicComponentsService,
    private readonly appRef: ApplicationRef,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly windowEvents: WindowEventsEmitterService
  ) { 
    //If there is no containerComponent this will create it
    if (!PopupDirective.popupContainerComponentRef) {
      this.appendToBody();
    }
  }

  /**
   * Keep in mind that all popup directive point to one container
   * This means if we want open another popup we need to first close the new one
   */
  @HostListener('click')
  onClick() {
    if(!this.useBoolToOpen){
      const { directiveElementRef } = this.getPopupInstance();
  
      if (this.getPopupInstance().visible) {
        if (directiveElementRef === this.elementRef) {
          this.visible = false;
        } else {
          this.visible = false;
          this.updateInstance();
          this.updatePosition();
          this.visible = true;
        }
      } else {
        this.updateInstance();
        this.updatePosition();
        this.visible = true;
      }
    }
  }


  ngOnChanges(simpleChanges: SimpleChanges): void {
    if(simpleChanges?.isOpen && this.useBoolToOpen){
      const { directiveElementRef } = this.getPopupInstance();
  
        if (directiveElementRef === this.elementRef) {
          this.visible = this.isOpen;
          this.updateInstance();
          this.updatePosition();
        } else {
          this.visible = false;
          this.updateInstance();
          this.updatePosition();
          this.visible = this.isOpen;
        }
      }
  }

  /**
   * This method creates and append the popup container ref to the body
   */
  private appendToBody() {
    PopupDirective.popupContainerComponentRef = this.dynamicComponentsService.createComponentElement(PopupContainerComponent);
    this.appRef.attachView(PopupDirective.popupContainerComponentRef.hostView);
    document.body.appendChild(this.getDomElement(PopupDirective.popupContainerComponentRef));
  }

  private getDomElement<T>(componentRef: ComponentRef<T>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0] as HTMLElement;
  }

  /**
   * Updating the position while checking if it fits on the screen based on this.initialPositionX
   * (but first we need to be sure that current directive is related to the opened container)
   */
  updatePosition() {
    if (this.getPopupInstance().directiveElementRef !== this.elementRef) {
      return;
    }

    const popupContainerElemRef = this.getPopupInstance().getCurrentPopupElementRef();
    const popupBoundingRect = popupContainerElemRef.getBoundingClientRect();

    const { left, top, width, height } = this.elementRef.nativeElement.getBoundingClientRect();

    if (this.adaptToElementWidth) {
      popupContainerElemRef.style.width = `${width}px`;
    }



    if(this.initialPositionY == 'bottom'){
      const elementFitsBeneath: boolean = top + height + popupBoundingRect.height <= window.innerHeight;
      if (elementFitsBeneath) {
        popupContainerElemRef.style.top = `${top + height}px`;
      } else {
        popupContainerElemRef.style.top = `${top - popupBoundingRect.height}px`;
      }
    }else {
      const elementFitsAbove: boolean = top - popupBoundingRect.height <= window.innerHeight;
      if (elementFitsAbove) {
        popupContainerElemRef.style.top = `${top - height - popupBoundingRect.height}px`;
      } else {
        popupContainerElemRef.style.top = `${top + height}px`;
      }
    }

    const elementFitsOnTheRight: boolean = left + popupBoundingRect.width <= window.innerWidth;

    if (elementFitsOnTheRight) {
      popupContainerElemRef.style.left = `${left}px`;
    } else {
      popupContainerElemRef.style.left = `${left + width - popupBoundingRect.width}px`;
    }
  }

  /**
   * Updating the content of the popupContainerComponent
   * Here is the magic related to set the current directive instance to be connected with the popup container
   */
  updateInstance() {
    if (!this.getPopupInstance()) {
      return;
    }

    const objToPass = {
      templateRef: this.templateRef,
      templateOutletContext: this.templateOutletContext,
      directiveElementRef: this.elementRef
    };
    this.getPopupInstance().updatePopupContent(objToPass);
  }

  /**
   * Shorthand 
   */
  getPopupInstance(): PopupContainerComponent {
    return PopupDirective.popupContainerComponentRef.instance;
  }

  /**
   * Shorthand
   */
  getPopupElement(): HTMLElement {
    return this.getDomElement(PopupDirective.popupContainerComponentRef);
  }


  /**
   * This method will update the visibility of the PopupContainer
   * Also subscribing and unsubscribing to window click event
   */
  private set visible(visible: boolean) {
    if (visible) {
      this.getPopupInstance().show();
      this.subscribeForWindowClick();
    } else {
      this.getPopupInstance().hide();
      this.unsubscribeFromWindowClick();
    }

    this.popupToggled.emit(visible);
  }

  // Window clicks subscriptions (This is because we want to have global click listener only when popup is open)
  subscribeForWindowClick(){
    this._clickOutEventSubscription = this.windowEvents.windowClickEventTriggered$.subscribe((e: Event) => {
      this.onDocumentClick(e)
    })
  }

  unsubscribeFromWindowClick(){
    if( this._clickOutEventSubscription){
      this._clickOutEventSubscription.unsubscribe();
    }
  }


  /**
   * This method is called when window click occurs
   * Checking if click is outside of the popup container or the element that the popup directive is attached to (if its it will hide the popup container)
   */
  onDocumentClick({ target }: Event) {

    /** This is not mandatory but will leave it as a double check */
    if (this.getPopupInstance().directiveElementRef !== this.elementRef) {
      return;
    }

    const targetIsNotPartOfThePopup = target !== this.getPopupElement() && !this.isChildOf(this.getPopupElement(), target as HTMLElement);
    const targetIsNotPartOfTheElementRef = target !== this.elementRef.nativeElement && !this.isChildOf(this.elementRef.nativeElement, target as HTMLElement);

    if (targetIsNotPartOfThePopup && targetIsNotPartOfTheElementRef) {
      this.visible = false;
    }

    if (!targetIsNotPartOfThePopup && this.closeUponClick) {
      this.visible = false;
    }
  }

  /**
   * Shorthand to be more easy for read
   */
  isChildOf(parent: HTMLElement, child: HTMLElement): boolean {
    return parent.contains(child)
  }



}
