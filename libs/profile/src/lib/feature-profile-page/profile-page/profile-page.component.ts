import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ImgUrlPipe, SvgIconComponent } from "@tt/common-ui";
import { ProfileService } from '../../data'
import {ProfileHeaderComponent} from "../../ui";
import {PostFeedComponent} from "@tt/posts";
import {ChatsService} from "@tt/chats";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    RouterLink,
    SvgIconComponent,
    ImgUrlPipe,
    PostFeedComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal(false); // Понимать наша страница или нет

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      // this.isMyPage.set(id === 'me') это один из вариантов, как обновлять страницу (т.е. если me, то моя страница, если нет, то не моя страница
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id); // это другой вариант, если на нашу страницу мы попали не через me, а через id
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    }),
  );

  async sendMessage(userId: number) {
      this.router.navigate(['/chats', 'new'], {queryParams: {userId}})
  }
}
