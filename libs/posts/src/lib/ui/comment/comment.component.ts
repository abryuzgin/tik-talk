import { Component, input } from '@angular/core';
import {PostComment} from "../../data";
import {AnywhereTimePipe, AvatarCircleComponent} from "@tt/common-ui";


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
