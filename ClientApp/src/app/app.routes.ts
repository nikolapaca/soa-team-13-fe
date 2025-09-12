import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './shared/map-component/map-component';
import { AllAccountsComponent } from './all-accounts/all-accounts.component';
import { ToursComponent } from './feature-modules/tour/tours/tours.component';
import { KeyPoint } from './feature-modules/tour/model/keyPoint.model';
import { KeyPointFormComponent } from './feature-modules/tour/key-point-form/key-point-form.component';
import { TourComponent } from './feature-modules/tour/tour/tour.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "map", component: MapComponent},
    {path: "all-accounts", component: AllAccountsComponent},
    {path: 'tours', component: ToursComponent},
    {path: 'key-point/:tourId/create', component: KeyPointFormComponent, pathMatch: 'full' },
    {path: 'key-point/:tourId/:kpId/update', component: KeyPointFormComponent },
    {path: 'tour/:tourId', component: TourComponent}
];
