import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, OnDestroy, OnInit, Renderer2, Type, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { InsertionDirective } from "../insertion.directive";
import { DialogRef } from "../dialog-ref";
import { DialogConfig } from "../dialog-config";

@Component({
  selector: 'dammings-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit, OnDestroy, AfterViewInit {
  componentRef!: ComponentRef<any>;
  childComponentType!: Type<any>;

  @ViewChild(InsertionDirective) insertionPoint!: InsertionDirective;

  constructor(
    private readonly renderer: Renderer2,
    private readonly cd: ChangeDetectorRef,
    private readonly dialogRef: DialogRef
  ) {}

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.renderer.setStyle(document.body, 'overflow', 'visible');
  }

  ngAfterViewInit(): void {
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }

  onOverlayClicked(evt: MouseEvent): void {
    this.dialogRef.close(null);
  }

  onDialogClicked(evt: MouseEvent): void {
    evt.stopPropagation();
  }

  loadChildComponent(componentType: Type<any>) {
    let viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentType);
  }
}
