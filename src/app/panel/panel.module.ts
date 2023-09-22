import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { PanelRoutingModule } from './panel-routing.module';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { PanelComponent } from './panel.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';

import { PanelRoutes } from './panel.routing';

import { APP_CONFIG } from './config.service';
import { environment } from '../../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    UpdateUserComponent,
    PanelComponent,
    ErrorPageComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(PanelRoutes)
  ],
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    UserService,
    ApiService,
    ConfigService,
  ]
})
export class PanelModule { }
