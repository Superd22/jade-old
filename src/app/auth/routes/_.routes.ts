import { Routes } from '@angular/router';
import { AuthRedirectComponent } from '../components/auth-redirect/auth-redirect.component';
export const AuthRoutes: Routes = [
    { path: 'auth/redirect', component: AuthRedirectComponent }
]