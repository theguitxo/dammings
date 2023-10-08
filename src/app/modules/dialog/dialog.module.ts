import { NgModule } from '@angular/core';
import { DialogService } from './dialog.service';
import { OverlayComponent } from './overlay/overlay.component';
import { InsertionDirective } from './insertion.directive';

@NgModule({
  declarations: [
    OverlayComponent,
    InsertionDirective
  ],
  providers: [DialogService],
  exports: [OverlayComponent]
})
export class DialogModule {}
