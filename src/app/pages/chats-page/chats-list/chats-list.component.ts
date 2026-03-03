import { Component, inject } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatsService } from '../../../data/services/chats.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map, startWith, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-chats-page-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl('');

  chats$ = timer(0, 3000).pipe(
    switchMap(() => this.chatsService.getMyChats()), // Делаем запрос к серверу (получаем свежие чаты)
    switchMap((chats) => {
      // Берет полученные чаты и комбинирует с потоком фильтра
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''), // Это нужно, чтобы при первой загрузке показать все чаты, без фильтрации
        map((inputValue) => {
          return chats.filter((chat) => {
            return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
              .toLowerCase()
              .includes((inputValue || '').toLowerCase());
          });
        })
      );
    })
  );
}

// chats$ = this.chatsService.getMyChats().pipe(
//   switchMap((chats) => {
//     return this.filterChatsControl.valueChanges.pipe(
//       startWith(''),
//       map((inputValue) => {
//         return chats.filter((chat) => {
//           return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
//             .toLowerCase()
//             .includes((inputValue || '').toLowerCase())
//         })
//       })
//     )
//   })
// )
