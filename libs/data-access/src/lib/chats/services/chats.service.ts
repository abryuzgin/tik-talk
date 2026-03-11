import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { ProfileService } from '../../profile';
import { map } from 'rxjs';
import { DateTime } from 'luxon';

export interface MessageGroup {
  dateIcon: string;
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<Message[]>([]);
  groupedMessages = signal<MessageGroup[]>([]);

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
            // Определяли кто отправитель
          };
        });

        const grouped = this.getGroupedMessages(patchedMessages);
        this.groupedMessages.set(grouped);
        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      }),
    );
  }

  getGroupedMessages(messages: Message[]): MessageGroup[] {
    const groups: MessageGroup[] = [];
    let currentDate = '';

    const sortedMessages = [...messages].sort(
      (a, b) =>
        DateTime.fromISO(a.createdAt).toMillis() -
        DateTime.fromISO(b.createdAt).toMillis(),
    );

    for (const message of sortedMessages) {
      const messageDate = DateTime.fromISO(message.createdAt, {
        zone: 'utc',
      }).setZone('local');
      const dateKey = messageDate.toFormat('yyyy-MM-dd');

      if (dateKey !== currentDate) {
        currentDate = dateKey;
        const dateIcon = this.getDateIcon(messageDate);
        groups.push({
          dateIcon: dateIcon,
          messages: [],
        });
      }
      groups[groups.length - 1].messages.push(message);
    }
    return groups;
  }

  private getDateIcon(date: DateTime): string {
    const today = DateTime.now().startOf('day');
    const yesterday = today.minus({ days: 1 });
    const messageDate = date.setZone('local').startOf('day');

    if (messageDate.equals(today)) {
      return 'Сегодня';
    } else if (messageDate.equals(yesterday)) {
      return 'Вчера';
    } else {
      return messageDate.toFormat('dd.MM.yyyy');
    }
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      },
    );
  }
}
