import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { canActivateAuth } from './auth/access.guard';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { chatsRoutes } from './pages/chats-page/chatsRoutes';
import { FormsLessonComponent } from './forms-lesson/forms-lesson.component';
import { MyFormsLessonComponent } from './my-forms-lesson/my-forms-lesson.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'search', component: SearchPageComponent },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth], // Защищаем и не дает зайти дальше страницы Логина
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'forms-lesson', component: FormsLessonComponent },
  { path: 'my-forms-lesson', component: MyFormsLessonComponent },
];
