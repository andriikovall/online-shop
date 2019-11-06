import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { PuzzlesComponent } from './puzzles/puzzles.component';
import { PuzzlesNewComponent } from './puzzles-new/puzzles-new.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { UserComponent } from './user/user.component';
import { ShellComponent } from './components/shell/shell.component';

import { AuthGuard } from './guards/auth/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard';
import { ManagerGuard } from './guards/manager/manager.guard';

const newRoutes: Routes = [
  {
    path: '', component: ShellComponent,
    children: [
      { path: '', component: IndexComponent },
      { path: 'about', component: AboutComponent },
      { path: 'users', component: UsersComponent },
      { path: 'puzzles', component: PuzzlesComponent },
      { path: 'puzzles/new', component: PuzzlesNewComponent, canActivate: [ManagerGuard]},
      { path: 'puzzles/:id', component: PuzzleComponent },
      { path: 'users/:id', component: UserComponent }
    ]
  }, 
  // { path: 'auth/register'}
]

@NgModule({
  imports: [RouterModule.forRoot(newRoutes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
