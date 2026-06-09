import { Routes } from '@angular/router';
import { DetailComponent } from './components/detail/detail.component';
import { HomeComponent } from './components/home/home.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':id', component: DetailComponent },
  { path: '**', redirectTo: '' }
];