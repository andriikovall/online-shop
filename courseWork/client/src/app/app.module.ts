import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

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
    PuzzleComponent
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
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  // entryComponents: [
  //   NgbModal
  // ]
})
export class AppModule { }
