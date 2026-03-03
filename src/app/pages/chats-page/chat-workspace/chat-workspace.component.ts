import { Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import { MessageInputComponent } from '../../../common-ui/message-input/message-input.component';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from '../../../data/services/chats.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  chatService = inject(ChatsService);

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => this.chatService.getChatById(id))
  );
}
