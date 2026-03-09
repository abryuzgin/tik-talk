import { Routes } from '@angular/router';
import { FormsLessonComponent } from './forms-lesson/forms-lesson.component';
import { MyFormsLessonComponent } from './my-forms-lesson/my-forms-lesson.component';
import {canActivateAuth, LoginPageComponent} from "@tt/auth";
import {chatsRoutes} from "@tt/chats";
import {ProfilePageComponent, SearchPageComponent, SettingsPageComponent} from "@tt/profile";
import {LayoutComponent} from "@tt/layout";


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
