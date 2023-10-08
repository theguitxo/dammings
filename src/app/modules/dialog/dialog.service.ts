import { ApplicationRef, ComponentRef, EmbeddedViewRef, Injectable, Injector, Type, createComponent } from "@angular/core";
import { OverlayComponent } from "./overlay/overlay.component";
import { DialogConfig } from "./dialog-config";
import { DialogInjector } from "./dialog-injector";
import { DialogRef } from "./dialog-ref";

@Injectable()
export class DialogService {
  overlayRef!: ComponentRef<OverlayComponent>;

  constructor(
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector
  ) {}

  appendOverlayComponentToBody(config: DialogConfig): DialogRef {
    const map = new WeakMap();
    map.set(DialogConfig, config);

    const dialogRef = new DialogRef();
    map.set(DialogRef, dialogRef);

    const sub = dialogRef.afterClosed.subscribe(() => {
      this.removeOverlayComponentFromBody();
      sub.unsubscribe();
    });

    const componentRef = createComponent(OverlayComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: new DialogInjector(this.injector, map)
    });

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<OverlayComponent>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.overlayRef = componentRef;

    return dialogRef;
  }

  removeOverlayComponentFromBody() {
    this.appRef.detachView(this.overlayRef.hostView);
    this.overlayRef.destroy();
  }

  open(componentType: Type<any>, config: DialogConfig): DialogRef {
    const dialogRef = this.appendOverlayComponentToBody(config);

    this.overlayRef.instance.childComponentType = componentType;

    return dialogRef;
  }

}
