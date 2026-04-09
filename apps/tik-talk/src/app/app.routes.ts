import { Routes } from '@angular/router';
import { FormsLessonComponent } from './forms-lesson/forms-lesson.component';
import { MyFormsLessonComponent } from './my-forms-lesson/my-forms-lesson.component';
import {canActivateAuth, LoginPageComponent} from "@tt/auth";
import {chatsRoutes} from "@tt/chats";
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from "@tt/profile";
import {LayoutComponent} from "@tt/layout";
import {provideState} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {PostEffects, postFeature} from "@tt/posts";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects),
        ]
      },
      { path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects),
        ]
      },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],

    canActivate: [canActivateAuth], // Защищаем и не дает зайти дальше страницы Логина
  },

  { path: 'login', component: LoginPageComponent },
  { path: 'forms-lesson', component: FormsLessonComponent },
  { path: 'my-forms-lesson', component: MyFormsLessonComponent },
];
