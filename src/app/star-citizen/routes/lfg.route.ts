import { Routes } from '@angular/router';
import { LookingForGroupComponent } from '../components/looking-for-group/looking-for-group.component';
import { LfgCriteresComponent } from '../components/looking-for-group/lfg-criteres/lfg-criteres.component';
import { LfgContactComponent } from '../components/looking-for-group/lfg-contact/lfg-contact.component';
import { LfgGroupesComponent } from '../components/looking-for-group/lfg-groupes/lfg-groupes.component';

export const LFGRoutes: Routes = [
    {
        path: 'LFG', component: LookingForGroupComponent, children: [
            { path: 'criteres', component: LfgCriteresComponent },
            { path: 'contact', component: LfgContactComponent },
            { path: 'groupes', component: LfgGroupesComponent },
        ]
    }
]