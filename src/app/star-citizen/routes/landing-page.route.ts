import { Routes } from '@angular/router';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';

export const SCLandingPageRoutes: Routes = [
    { path: 'landing', component: LandingPageComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
]