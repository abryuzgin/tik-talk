import {
  Component,
  EventEmitter,
  inject,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {ProfileService} from "@tt/data-access";
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [AvatarCircleComponent, FormsModule, NgIf, SvgIconComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2);
  me = inject(ProfileService).me;

  @Output() created = new EventEmitter<string>();

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto'); // Чтобы заскроленный текст вернулся в одну строку
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onSend() {
    if (this.postText.trim()) {
      this.created.emit(this.postText);
      this.postText = '';
    }
  }
}
