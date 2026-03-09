import { Component, input } from '@angular/core';
import { AnywhereTimePipe, AvatarCircleComponent, SvgIconComponent } from "@tt/common-ui";
import { LastMessageRes } from '../../data'

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, AnywhereTimePipe, SvgIconComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
}
