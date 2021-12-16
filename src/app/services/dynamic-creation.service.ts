import {
  Injectable,
  ComponentFactoryResolver, Type, ViewContainerRef, ComponentRef,
} from '@angular/core';


@Injectable({ providedIn: 'root' })
export class DynamicCreationService {

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {

  }

  public createInst<T>(t: Type<T>, target: ViewContainerRef, initModel: (model: T) => void): ComponentRef<T> {

    let factory = this._componentFactoryResolver.resolveComponentFactory(t);

    let comp = factory.create(target.injector);

    target.insert(comp.hostView);

    if (initModel) {
      initModel(comp.instance);
    }

    return comp;

  }
}
