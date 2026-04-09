import {Component, inject, OnInit} from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from "@tt/data-access";

@Component({
  imports: [
    SvgIconComponent,
    NgForOf,
    SubscriberCardComponent,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  selector: 'app-sidebar',
  standalone: true,
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  // Получаем профиль сервис для наших подписчиков
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList();

  // Информация о нас
  me = this.profileService.me;

  // Делаем цикл, чтобы не перепечатывать все в sidebar.component.html (моя страница, чаты, поиск)
  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chat',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
