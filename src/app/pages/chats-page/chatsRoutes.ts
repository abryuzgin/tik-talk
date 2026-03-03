import { ChatsPageComponent } from './chats.component';
import { Route } from '@angular/router';
import { ChatWorkspaceComponent } from './chat-workspace/chat-workspace.component';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];

