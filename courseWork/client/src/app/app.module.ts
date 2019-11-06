import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { PuzzlesComponent } from './puzzles/puzzles.component'
import { UsersComponent } from './users/users.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PuzzlesNewComponent } from './puzzles-new/puzzles-new.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { ConfirmComponent } from './modals/confirm-danger/confirm.component';
import { UserComponent } from './user/user.component';
import { ConfirmSafetyComponent } from './modals/confirm-safety/confirm-safety.component';
import { ShellComponent } from './components/shell/shell.component';
import { RegisterComponent } from './modals/register/register.component';
import { LoginComponent } from './modals/login/login.component';

import { TokenInterseptorService } from './services/token/token-interseptor.service';
import { RolesDirective } from './directives/roles.directive';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    MainComponent,
    IndexComponent,
    AboutComponent,
    UsersComponent,
    PuzzlesComponent,
    PuzzlesNewComponent,
    PuzzleComponent,
    ConfirmComponent,
    UserComponent,
    ConfirmSafetyComponent,
    ShellComponent, 
    RegisterComponent,
    LoginComponent,
    RolesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule
  ],
  providers: [
    NgbActiveModal,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterseptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmComponent,
    ConfirmSafetyComponent,
    RegisterComponent,
    LoginComponent
  ]
})
export class AppModule { }
