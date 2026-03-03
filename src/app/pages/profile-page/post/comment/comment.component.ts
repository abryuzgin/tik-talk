import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { PostComment } from '../../../../data/interfaces/post.interface';
import { AnywhereTimePipe } from '../../../../helpers/pipes/anywheretime.pipe';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, AnywhereTimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
