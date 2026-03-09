import { ChatWorkspaceComponent } from "../chat-workspace/chat-workspace.component";
import { ChatsPageComponent } from './chats.component';
import { Route } from '@angular/router';


export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];
