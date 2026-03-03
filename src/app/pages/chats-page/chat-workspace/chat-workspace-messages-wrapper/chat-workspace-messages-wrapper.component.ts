import {
  Component,
  effect,
  AfterViewInit,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component';
import {
  ChatsService,
  MessageGroup,
} from '../../../../data/services/chats.service';
import { Chat, Message } from '../../../../data/interfaces/chats.interface';
import {
  debounceTime,
  firstValueFrom,
  interval,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent
  implements OnDestroy, AfterViewInit
{
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  chatsService = inject(ChatsService);
  groupedMessages = this.chatsService.groupedMessages;

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  private destroy$ = new Subject<void>();
  private resize$ = new Subject<void>();

  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessages;

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
    setTimeout(() => {
      this.scrollDown();
    }, 100);
  }

  constructor() {
    // effect((onCleanup) => {
    //   this.groupedMessages()
    //   // отписка от setTimeout (если компонент уничтожится до выполнения setTimeout нужно отписаться от setTimeout, чтобы не было ошибки. Т.е. отправил сообщение и через 50мс нажал на другую страницу, setTimeout продолжает работать (100мс), но ты уже в другом месте. Будет ошибка
    //   const timeout = setTimeout(() => {
    //   this.scrollDown()
    //   }, 100)
    //
    //   onCleanup(() => {
    //     clearTimeout(timeout)
    //   })
    // })

    this.resize$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });

    // timer(0, 3000).pipe(
    //   switchMap(() => { // switchMap отменяет предыдущий незавершенный запрос при новом значении (принимает каждое значение из timer и преобразует его в новый Observable)
    //     // Представьте, что сервер тормозит и отвечает 10 секунд, а таймер тикает каждые 5 секунд. Без switchMap накопится куча одновременных запросов. С switchMap каждый новый запрос отменяет предыдущий.
    //     const currentChatId = this.chat()?.id;
    //     if (!currentChatId) return []; // Проверка безопасности, Если нет активного чата, возвращаем пустой массив
    //     return this.chatsService.getChatById(currentChatId); // Именно этот Observable будет выполнен switchMap
    //   }),
    //   takeUntil(this.destroy$)
    // ).subscribe();
  }

  private scrollDown() {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resize$.next();
  }

  ngAfterViewInit() {
    this.resizeFeed();
    this.scrollDown();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect(); // getBoundingClientRect - пришлет координаты, где расположен элемент

    const height = window.innerHeight - top - 25;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
