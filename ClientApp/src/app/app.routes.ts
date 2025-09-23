import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './shared/map-component/map-component';
import { AllAccountsComponent } from './all-accounts/all-accounts.component';
import { ToursComponent } from './feature-modules/tour/tours/tours.component';
import { KeyPointFormComponent } from './feature-modules/tour/key-point-form/key-point-form.component';
import { TourFormComponent } from './feature-modules/tour/tour-form/tour-form.component';
import { TourComponent } from './feature-modules/tour/tour/tour.component';
import { ProfileComponent } from './profile/profile.component';
import { PublishedToursComponent } from './feature-modules/tour/published-tours/published-tours.component';
import { CartComponent } from './feature-modules/shopping-cart/cart/cart.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "map", component: MapComponent},
    {path: "all-accounts", component: AllAccountsComponent},
    {path: 'tours', component: ToursComponent},
    {path: 'add-tour', component: TourFormComponent},
    {path: 'key-point/:tourId/create', component: KeyPointFormComponent, pathMatch: 'full' },
    {path: 'key-point/:tourId/:kpId/update', component: KeyPointFormComponent },
    {path: 'tour/:tourId', component: TourComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'published-tours', component: PublishedToursComponent},
    {path: 'cart', component: CartComponent}
];
