import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './components/home/home.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':id', component: DetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
