import { Component, input } from '@angular/core';
import {AnywhereTimePipe, AvatarCircleComponent} from "@tt/common-ui";
import {PostComment} from "@tt/data-access";

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
