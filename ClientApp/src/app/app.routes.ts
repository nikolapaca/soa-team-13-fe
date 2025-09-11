import { Routes } from '@angular/router';
import { ToursComponent } from './feature-modules/tour/tours/tours.component';
import { KeyPoint } from './feature-modules/tour/model/keyPoint.model';
import { KeyPointFormComponent } from './feature-modules/tour/key-point-form/key-point-form.component';

export const routes: Routes = [
  {path: 'tours', component: ToursComponent},
  {path: 'key-point', component: KeyPointFormComponent}
];
