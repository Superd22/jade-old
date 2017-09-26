import { Routes } from '@angular/router';
import { LookingForMembersComponent } from '../components/looking-for-members/looking-for-members.component';
import { LfmMembersComponent } from '../components/looking-for-members/lfm-members/lfm-members.component';

export const LFGRoutes: Routes = [
    {
        path: 'LFM', component: LookingForMembersComponent, children: [
            { path: 'members', component: LfmMembersComponent },
        ]
    }
]