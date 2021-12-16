import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DynamicCreationService } from 'src/app/services/dynamic-creation.service';

@Injectable({providedIn: 'root'})
export class DialogService {
  constructor(
    private dynamicSvc: DynamicCreationService
  ) { }

  public isOpened = true;

  public closeClicked = new Subject();

  public viewContainer: ViewContainerRef;

  public componentRef: ComponentRef<any>;

  public create<T>(t: Type<T>, initModel: (model: T) => void) {
    this.componentRef = this.dynamicSvc.createInst(t, this.viewContainer, initModel);
    return <ComponentRef<T>>this.componentRef;
  }

  public destroy() {
    this.componentRef.destroy();
  }


}
