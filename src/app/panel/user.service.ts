import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { RolesList, RolesListItem, User, UsersList } from './User';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    protected api: ApiService
  ) {}

  getRoles(): Observable<Array<RolesListItem>> {
    return this.http.get<Array<RolesListItem>>(`${this.api.apiDemoUcgUrl}/user_types`);
  }

  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.api.apiDemoUcgUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.api.apiDemoUcgUrl}/users/${id}`);
  }

  createUser(value: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: number;
  }) {
    return this.http.post<{ data: User }>(`${this.api.apiDemoUcgUrl}/users`, value);
  }

  updateUser(id: number, value: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: number;
  }) {
    return this.http.put<{ data: User }>(`${this.api.apiDemoUcgUrl}/users/${id}`, value);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.api.apiDemoUcgUrl}/users/${id}`);
  }
}
