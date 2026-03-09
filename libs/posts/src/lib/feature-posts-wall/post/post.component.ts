import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from "@tt/profile";
import { CommentComponent, PostInputComponent } from '../../ui'
import { Post, PostComment, PostService } from "../../data";
import { AnywhereTimePipe, AvatarCircleComponent, SvgIconComponent } from "@tt/common-ui";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    AnywhereTimePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  profile = inject(ProfileService).me;
  comments = signal<PostComment[]>([]);

  postService = inject(PostService);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated(commentText: string) {
    firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      }),
    ).then(async () => {
      const comments = await firstValueFrom(
        this.postService.getCommentsByPostId(this.post()!.id),
      );
      this.comments.set(comments);
    });
    return;
  }
}
