import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { IndexComponent } from './components/index/index.component';
import { AboutComponent } from './components/about/about.component';
import { PuzzlesComponent } from './components/puzzles/puzzles.component'
import { UsersComponent } from './components/users/users.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PuzzlesNewComponent } from './components/puzzles-new/puzzles-new.component';
import { PuzzleComponent } from './components/puzzle/puzzle.component';
import { ConfirmComponent } from './modals/confirm-danger/confirm.component';
import { UserComponent } from './components/user/user.component';
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
