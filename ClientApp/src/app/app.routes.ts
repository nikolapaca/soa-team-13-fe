import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './shared/map-component/map-component';
import { AllAccountsComponent } from './all-accounts/all-accounts.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "map", component: MapComponent},
    {path: "all-accounts", component: AllAccountsComponent}
];
