import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../User';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{

  users: Array<User> = [];
  users$!: Observable<User[]>;
  selectedId: number = 0;

  constructor(
    protected userService: UserService,
    protected router: Router,
    ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.users$ = this.userService.getUsers();
  }

  openCreatePage(){
    this.router.navigate([`/panel/users/create`]);
  }

}
