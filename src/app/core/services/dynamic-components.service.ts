import { ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentsService {

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly injector: Injector
  ) { }

  createComponentElement<T>(componentType: Type<T>): ComponentRef<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const component: ComponentRef<T> = componentFactory.create(this.injector);

    component.changeDetectorRef.detectChanges();
    
    return component;
  }
}
