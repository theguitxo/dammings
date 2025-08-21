import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  Type,
  ViewChild,
} from '@angular/core';
import { DialogRef } from '../dialog-ref';
import { InsertionDirective } from '../insertion.directive';

@Component({
    selector: 'dammings-overlay',
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.scss'],
    standalone: false
})
export class OverlayComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly renderer = inject(Renderer2);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly dialogRef = inject(DialogRef);

  componentRef!: ComponentRef<any>;
  childComponentType!: Type<any>;

  @ViewChild(InsertionDirective) insertionPoint!: InsertionDirective;

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
