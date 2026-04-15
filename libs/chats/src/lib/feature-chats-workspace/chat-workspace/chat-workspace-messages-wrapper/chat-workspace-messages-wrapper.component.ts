
import {
  Component,
  AfterViewInit,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  ViewChild,
  OnDestroy,
  effect
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui'
import { debounceTime, firstValueFrom, Subject, takeUntil } from 'rxjs';
import {Chat, ChatsService} from "@tt/data-access";

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
  messages = this.chatsService.activeChatMessages;

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  private destroy$ = new Subject<void>();
  private resize$ = new Subject<void>();

  chat = input.required<Chat>();

  async onSendMessage(messageText: string) {
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id)

    // await firstValueFrom(
    //   this.chatsService.sendMessage(this.chat().id, messageText),
    // );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  constructor() {
    this.resize$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });

    effect(() => {
      const currentMessages = this.messages()
      if (currentMessages.length > 0) {

        const updatedGroups = this.chatsService.getGroupedMessages(currentMessages);
        this.groupedMessages.set(updatedGroups);

        setTimeout(() => {
          this.scrollDown();
        }, 100)
      }
    })
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
