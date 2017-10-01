import { Routes } from '@angular/router';
import { LookingForMembersComponent } from '../components/looking-for-members/looking-for-members.component';
import { LfmMembersComponent } from '../components/looking-for-members/lfm-members/lfm-members.component';

export const LFMRoutes: Routes = [
    {
        path: 'LFM', component: LookingForMembersComponent, children: [
            { path: 'criteres', component: LfmMembersComponent },
            { path: 'contact', component: LfmMembersComponent },
            { path: 'members', component: LfmMembersComponent },
        ]
    }
]