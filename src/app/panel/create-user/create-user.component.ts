import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { RolesListItem } from '../User';
import { UserService } from '../user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  hidePassword = true;


  public rolesList$ = new BehaviorSubject<Array<RolesListItem>>([]);
  public filteredRoles$ = new BehaviorSubject<Array<RolesListItem>>([]);

  userForm = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    first_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    last_name: this.fb.control('', [Validators.required, Validators.maxLength(20)]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    type: this.fb.control(2, Validators.required),
    password: this.fb.control('', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}'), Validators.required]),
    confirm_password: this.fb.control('', [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}'), Validators.required]),
  },
    { validators: [ this.checkPasswords() ] }
  );

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected userService: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.userService.getRoles().subscribe((roles) => {
      this.rolesList$.next(roles);
      this.filteredRoles$.next(roles);
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
      .createUser(request)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.toastr.success(
            `${'User Created Successfully' + ' :)'}`,
            `${'Whoooohooo!'}`,
          );
          console.log(resp);
          this.userForm.reset();
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

  checkPasswords() {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirm_password');

      if (!passwordControl || !confirmPasswordControl) {
        console.log(this.userForm);
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        console.log(this.userForm);
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        console.log(this.userForm);
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        console.log(this.userForm);
        return null;
      }
    };
  }

  returnAction(){
    this.router.navigate([`/panel/users`]);
  }

  get password(): FormControl {
    return this.userForm.controls['password'] as FormControl;
  }
  get confirm_password(): FormControl {
    return this.userForm.controls['confirm_password'] as FormControl;
  }
  get type(): FormControl {
    return this.userForm.controls['type'] as FormControl;
  }

}
