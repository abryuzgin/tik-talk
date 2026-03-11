import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {GlobalStoreService} from "@tt/data-access";

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);


  isCommentInput = input(false);
  postId = input<number>(0);
  profile = inject(GlobalStoreService).me;

  @Output() created = new EventEmitter();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

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
