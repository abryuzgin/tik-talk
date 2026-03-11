import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { PostComponent } from '../post/post.component';
import { PostInputComponent } from "../../ui";
import {
  debounceTime,
  firstValueFrom,
  Subject,
  takeUntil,
} from 'rxjs';
import {GlobalStoreService} from "@tt/data-access";
import {PostService} from "@tt/data-access";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  profile = inject(GlobalStoreService).me;
  feed = this.postService.posts; // nado?

  private destroy$ = new Subject<void>();
  private resize$ = new Subject<void>();

  constructor() {
    this.loadPosts();

    this.resize$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
        console.log(123);
      });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resize$.next();
  }

  ngAfterViewInit() {
    this.resizeFeed();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect(); // getBoundingClientRect - пришлет координаты, где расположен элемент

    const height = window.innerHeight - top - 48;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  loadPosts() {
    firstValueFrom(this.postService.fetchPosts()).then((posts) => {
      this.postService.posts.set(posts);
    });
  }

  onCreatePost(postText: string) {
    if (!postText) return;

    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.profile()!.id,
      }),
    ).then(() => {
      this.loadPosts();
    });
  }
}
