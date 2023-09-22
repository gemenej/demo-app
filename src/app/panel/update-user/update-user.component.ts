import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { RolesListItem, User } from '../User';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  private userId: number = 0;
  hidePassword = true;

  public rolesList$ = new BehaviorSubject<Array<RolesListItem>>([]);
  public filteredRoles$ = new BehaviorSubject<Array<RolesListItem>>([]);

  userForm = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    first_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    last_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    type: this.fb.control(0, [Validators.pattern("[0-9]*")]),
    password: this.fb.control('', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')]),
  });

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected fb: FormBuilder,
    protected userService: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.pipe(take(1)).subscribe((params) => {
      console.log(params['user_id']);
      if (params['user_id']) {
        this.userId = params['user_id'];
        this.getUser();
      }
    });

  }

  getUser(): void {
    this.userService.getUser(this.userId).subscribe((user: User) => {
      this.userForm.patchValue({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        type: user.user_type,
      });
    });
  }

  submit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      console.log(this.userForm);
      return;
    }

    const request = this.getRequest(this.userForm.controls);

    this.userService
      .updateUser(this.userId, request)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.toastr.success(
            `${'User Created Successfully' + ' :)'}`,
            `${'Whoooohooo!'}`,
          );
          console.log(resp);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(`${err.error.message}`, `${'Something went wrong!'}`);
        },
    });
  }

  private getRequest(form: any) {
    return {
      username: form.username.value,
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      type: form.type.value,
      password: form.password.value,
    };
  }

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe({
      next: (resp) => {
        this.toastr.success(
          `${'User Deleted Successfully' + ' :)'}`,
          `${'Whoooohooo!'}`,
        );
        this.router.navigate([`/panel/users`]);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(`${err.error.message}`, `${'Something went wrong!'}`);
      },
    });
  }

  returnAction(){
    this.router.navigate([`/panel/users`]);
  }

  get password(): FormControl {
    return this.userForm.controls.password as FormControl;
  }

  get type(): FormControl {
    return this.userForm.controls.type as FormControl;
  }
}
