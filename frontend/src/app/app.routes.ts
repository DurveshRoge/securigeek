import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list.component';
import { IssueDetailComponent } from './components/issue-detail/issue-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { path: 'issues', component: IssueListComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
  { path: '**', redirectTo: '/issues' }
];