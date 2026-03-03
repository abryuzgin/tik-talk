import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { LastMessageRes } from '../../../data/interfaces/chats.interface';
import { AnywhereTimePipe } from '../../../helpers/pipes/anywheretime.pipe';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';

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
