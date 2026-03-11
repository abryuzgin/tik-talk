import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@tt/data-access'

export const canActivateAuth = () => {
  // Запрашиваем нужный нам сервис
  const isLoggedIn = inject(AuthService).isAuth;

  if (isLoggedIn) {
    return true;
  }
  // Запрашиваем у Ангуляра сущность Роутер, которая перенаправит на страницу Логина
  return inject(Router).createUrlTree(['/login']);
};

// Guard - просто функция (давать доступ или не давать)
