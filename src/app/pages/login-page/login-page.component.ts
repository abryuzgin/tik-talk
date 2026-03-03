import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Ниже сигнал (ifPasswordVisible). А сигнал это некий контейнер для значений.
  // Это некая функция, которую если мы вызовем, то мы получим значение, которое таится внутри сигнала
  ifPasswordVisible = signal<boolean>(false);

  // Делаем реактивную форму
  form = new FormGroup({
    // Создали форму
    username: new FormControl<string | null>(null, Validators.required), // Прокинули контролы, которые у нее есть (username)
    password: new FormControl<string | null>(null, Validators.required), // Прокинули контролы, которые у нее есть (password)
  });

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore // Это для того, чтобы глушить ошибки (т.к. this.form.value (ниже) может быть null or undefined
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigate(['']);
        console.log(res);
      });
    }
  }
}

// у любого стрима в RxJS есть метод pipe, в этом методе передаем всевозможные преобразователи, а-ля map, take, skip ect...
